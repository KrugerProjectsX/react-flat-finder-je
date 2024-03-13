    import * as React from "react";
    import Button from "@mui/material/Button";
    import TextField from "@mui/material/TextField";
    import Link from "@mui/material/Link";
    import Grid from "@mui/material/Grid";
    import Box from "@mui/material/Box";
    import InputLabel from "@mui/material/InputLabel";
    import MenuItem from "@mui/material/MenuItem";
    import FormControl from "@mui/material/FormControl";
    import Select from "@mui/material/Select";
    export default function FormRegister() {
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
        email: data.get("email"),
        password: data.get("password"),
        }); 
    };
    const currentDate = new Date().toISOString().slice(0, 10);

    return (
        <>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                {/* <p className="text-blue-500">Birthday</p> */}
                <TextField
                required
                fullWidth
                name="birthday"
                defaultValue={currentDate}
                label="Birthday"
                type="date"
                id="birthday"
                autoComplete="birthday"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">
                    Gender
                </InputLabel>
                <Select
                    labelId="gender"
                    id="gender"
                    // value={age}
                    //   onChange={handleChange}
                    label="Gender"
                >
                    <MenuItem value="">
                    <em>None</em>
                    </MenuItem>
                    <MenuItem value={"Masculine"}>Masculine</MenuItem>
                    <MenuItem value={"Female"}>Female</MenuItem>
                    <MenuItem value={"I prefer not to say"}>
                    I prefer not to say
                    </MenuItem>
                </Select>
                </FormControl>
            </Grid>
            </Grid>
            <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            >
            Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
            <Grid item>
                <Link href="/" variant="body2">
                Already have an account? Sign in
                </Link>
            </Grid>
            </Grid>
        </Box>
        </>
    );
    }
