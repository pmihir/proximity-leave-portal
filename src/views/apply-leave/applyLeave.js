import Head from "next/head";
import styles from "./applyLeave.module.css";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { useRef, useState, useEffect } from "react";
import DatePicker from "@mui/lab/DatePicker";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Card from "@mui/material/Card";
import { useRouter } from "next/router";
import { signOut, getSession } from "next-auth/client";
import { Notify } from "../../services/notification-manager";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import Checkmark from "../../components/checkmark/checkmark";
import Cross from "../../components/cross/cross";
import Cookies from "universal-cookie";

const DEPARTMENTS = [
  {
    value: "ENG",
    label: "Engineering",
  },
  {
    value: "DES",
    label: "Design",
  },
  {
    value: "ADM",
    label: "Admin",
  },
];

export default function ApplyLeave({ session }) {
  const [formData, setFormData] = useState({
    name: {
      val: "",
      error: "",
    },
    department: {
      val: "",
      error: "",
    },
    fromDate: {
      val: "",
      error: "",
    },
    toDate: {
      val: "",
      error: "",
    },
    reason: {
      val: "",
      error: "",
    },
  });
  const [userName, setUserName] = useState("");
  // const router = useRouter();
  const tokenRef = useRef(null);
  const [isApi, setIsApi] = useState(false);
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const [responseData, setResponseData] = useState({
    slack: null,
    email: null,
    timely: null,
  });
  const cookies = new Cookies();

  useEffect(() => {
    // tokenRef.current = JSON.parse(window.localStorage.getItem("timelyToken"));
    tokenRef.current = cookies.get('timeToken');
    console.log("Apply Leave", cookies.get('timeToken'));

    // getSession().then((session) => {
    //   if (!session) {
    //     router.replace("/");
    //   } else {
    //     sessionRef.current = session;
    //     const user = session.user
    //       ? session.user.name
    //       : (function () {
    //           throw new Error("user not authenticated");
    //         })();
    //     setUserName(user);
    //   }
    // });
  }, []);

  useEffect(() => {
    if (session) {
      const user = session.user
        ? session.user.name
        : (function () {
            throw new Error("user not authenticated");
          })();
      setUserName(user);
    }
  }, [session]);

  const [notificationStatus, setNotificationStatus] = useState({
    slack: false,
    timely: false,
    email: false,
  });
  const submitHandler = (e) => {
    e.preventDefault();
    const userEmail = session.user.email
      ? session.user.email
      : (function () {
          throw new Error("user not authenticated");
        })();

    if (formData.fromDate.val > formData.toDate.val) {
      setFormData({
        ...formData,
        fromDate: {
          val: formData.fromDate.val,
          err: "From Date should be less than or equal to To Date",
        },
      });
      return;
    }

    const data = {
      name: userName,
      department: formData.department.val,
      fromDate: formData.fromDate.val,
      toDate: formData.toDate.val,
      reason: formData.reason.val,
    };
    console.log(formData.fromDate.val, formData.toDate.val);
    console.log("Object Data",data);
    setIsApi(true);
    setIsBtnDisabled(true);
    Notify(
      userName,
      userEmail,
      data.fromDate,
      data.toDate,
      data.department,
      data.reason,
      tokenRef.current
    ).then((res) => {
      console.log(res);
      setResponseData({
        email: res.email,
        slack: res.slack,
        timely: res.timely,
      });
      setIsBtnDisabled(false);
      setNotificationStatus({ ...res });
    });

    setFormData({
      ...formData,
      name: { val: "", err: "" },
      department: { val: "", err: "" },
      fromDate: { val: null, err: "" },
      toDate: { val: null, err: "" },
      reason: { val: "", err: "" },
    });
  };

  const onFormChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: { val: value, err: "" } });
  };

  const fromDateChangeHandler = (e) => {
    setFormData({ ...formData, fromDate: { val: e, err: "" } });
  };

  const toDateChangeHandler = (e) => {
    setFormData({ ...formData, toDate: { val: e, err: "" } });
  };

  const onLogout = () => {
    signOut({
      callbackUrl: process.env.callbackUri,
    }).then(() => {
      // window.localStorage.clear();
      cookies.remove('timeToken');
    });
  };

  return (
    <div className={styles.container}>
      {console.log("response date", responseData)}
      <Head>
        <title>Leave Portal</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        <div className={styles.logoutBtnWrapper}>
          <Button
            variant="contained"
            onClick={onLogout}
            style={{ backgroundColor: "white", color: "black" }}
          >
            Logout
          </Button>
        </div>
      </header>
      <main className={styles.main}>
        <h1 className={styles.heading}>Proximity Works Leave Application</h1>
        <Card variant="outlined" sx={{ width: "45rem", height: "35rem" }}>
          <div className={styles.wrapper}>
            <form className={styles.form} onSubmit={submitHandler}>
              <div className={styles.formInput}>
                <TextField
                  id="standard-basic"
                  label="Name"
                  name="name"
                  required
                  variant="standard"
                  disabled
                  value={userName}
                />
              </div>
              <div className={styles.formInput}>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-standard-label" required>
                    Department
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={formData.department.val}
                    onChange={(e) => onFormChangeHandler(e)}
                    label="Department"
                    required
                    name="department"
                    sx={{
                      "div.MuiFormControl-root": {
                        margin: 0,
                      },
                    }}
                  >
                    {DEPARTMENTS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className={styles.formDates}>
                <div className={styles.formInput}>
                  <div>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="From Date"
                        value={formData.fromDate.val}
                        onChange={(e) => fromDateChangeHandler(e)}
                        name="fromDate"
                        error={true}
                        helperText={"Requireed"}
                        required
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </div>
                  <div className={styles.fromDateError}>
                    {formData.fromDate.err && (
                      <div>{formData.fromDate.err}</div>
                    )}
                  </div>
                </div>
                <div className={styles.formInput}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="To Date"
                      value={formData.toDate.val}
                      onChange={(e) => toDateChangeHandler(e)}
                      name="toDate"
                      required
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </div>
              </div>
              <div className={styles.formInput}>
                <TextField
                  id="outlined-multiline-static"
                  label="Reason"
                  name="reason"
                  multiline
                  rows={4}
                  value={formData.reason.val}
                  onChange={(e) => onFormChangeHandler(e)}
                  required
                />
              </div>
              <div className={styles.submitBtnWrapper}>
                <div className={styles.btnWrapper}>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={isBtnDisabled}
                    style={{
                    backgroundColor: isBtnDisabled ? '' :"#192030e0",
                      width: "15rem",
                      padding: "1rem 0",
                      height: "4rem",
                    }}
                  >
                    Send Request
                  </Button>
                </div>
                {isApi && (
                  <div className={styles.progressWrapper}>
                    <div className={styles.progress}>
                      <div className={styles.progressName}>Slack Update </div>
                      <div>
                        {responseData.slack === null ? (
                          <CircularProgress
                            style={{ height: "15px", width: "15px" }}
                          />
                        ) : responseData.slack ? (
                          <Checkmark />
                        ) : (
                          <Cross />
                        )}
                        {/* {responseData.slack ? (
                          <Checkmark />
                        ) : (
                          <CircularProgress
                            style={{ height: "15px", width: "15px" }}
                          />
                        )} */}
                        {/* <Cross /> */}
                      </div>
                    </div>
                    <div className={styles.progress}>
                      <div className={styles.progressName}>Timely Update </div>
                      <div>
                        {responseData.timely === null ? (
                          <CircularProgress
                            style={{ height: "15px", width: "15px" }}
                          />
                        ) : responseData.timely ? (
                          <Checkmark />
                        ) : (
                          <Cross />
                        )}
                      </div>
                    </div>
                    <div className={styles.progress}>
                      <div className={styles.progressName}>Email Update</div>
                      <div>
                        {responseData.email === null ? (
                          <CircularProgress
                            style={{ height: "15px", width: "15px" }}
                          />
                        ) : responseData.email ? (
                          <Checkmark />
                        ) : (
                          <Cross />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </Card>
      </main>
    </div>
  );
}
