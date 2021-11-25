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
import { signOut, useSession } from "next-auth/client";
import { Notify } from "../../services/notification-manager";

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

export default function ApplyLeave() {
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
  const [session] = useSession();
  const router = useRouter();
  const tokenRef = useRef(null);

  useEffect(() => {
    if (session === null) {
      router.replace("/");
    }
  }, [session, router]);

  useEffect(() => {
    tokenRef.current = JSON.parse(window.localStorage.getItem("timelyToken"));
    if (session) {
      const user = session.user
        ? session.user.name
        : (function () {
            throw new Error("user not authenticated");
          })();
      setUserName(user);
    }
  }, []);

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
      name: formData.name.val,
      department: formData.department.val,
      fromDate: formData.fromDate.val,
      toDate: formData.toDate.val,
      reason: formData.reason.val,
    };

    console.log(data);

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
      setNotificationStatus({ ...res });
    });

    // setFormData({
    //   ...formData,
    //   name: { val: "", err: "" },
    //   department: { val: "", err: "" },
    //   fromDate: { val: null, err: "" },
    //   toDate: { val: null, err: "" },
    //   reason: { val: "", err: "" },
    // });
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
    signOut();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Leave Portal</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        <div>
          <Button variant="contained" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </header>
      <main className={styles.main}>
        <h1 className={styles.heading}>Proximity Works Leave Application</h1>
        <Card variant="outlined" sx={{ width: "45rem", height: "34rem" }}>
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
              <div>
                <div className={styles.btnWrapper}>
                  <Button
                    variant="contained"
                    type="submit"
                    style={{
                      backgroundColor: "black",
                      width: "15rem",
                      padding: "1rem 0",
                    }}
                  >
                    Send Request
                  </Button>
                </div>
                <div></div>
              </div>
            </form>
          </div>
        </Card>
      </main>
    </div>
  );
}
