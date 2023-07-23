import { LocalJwt } from "../types/AuthTypes";
import React, { useContext} from "react";
import { Button, Grid, Paper, Typography, Stack, Link, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AppUserContext } from "../context/StateContext";
import { getClaimsFromJwt } from "../services/jwtHelper";
import api from "../services/axiosService";
import Iconify from "../components/iconify"

const BASE_URL: string = import.meta.env.VITE_API_URL;

const LoginPage: React.FC = () => {
  const { setAppUser } = useContext(AppUserContext);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await api.post("/Authentication/Login");

      if (response.status === 200) {
        const accessToken = response.data.accessToken;
        const { uid, email, given_name, family_name } = getClaimsFromJwt(accessToken);
        const expires: string = response.data.expires;

        setAppUser({ id: uid, email, firstName: given_name, lastName: family_name, expires, accessToken });

        const localJwt: LocalJwt = {
          accessToken,
          expires,
        };

        localStorage.setItem("upcrawler_user", JSON.stringify(localJwt));
        navigate("/order");
      } else {
        console.log(response.statusText);
      }
    } catch (error) {
      console.log("Something went wrong!");
    }
  };


  const onGoogleLoginClick = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `${BASE_URL}/Authentication/GoogleSignInStart`;
  };

  return (
    <Grid container justifyContent="center" >
      <Grid item xs={12} sm={6} md={4}>
        <Paper elevation={3} sx={{ padding: "2rem" }}>
          <Grid container spacing={2} direction="column">

          <Container maxWidth="sm">
              <Typography variant="h5" gutterBottom>
              Sign in to Up Crawler
            </Typography>
            <Typography variant="body2" sx={{ mb: 5 }}>
              Don’t have an account? {''}
              <Link variant="subtitle2">Get started</Link>
            </Typography>
          
            <form onSubmit={handleSubmit}>
                <Stack direction="row" spacing={2}>
                
              <Button fullWidth size="large" color="error" variant="outlined" onClick={onGoogleLoginClick}>
                <Iconify icon="eva:google-fill" color="#DF3E30" width={22} height={22} />
              </Button>

              <Button fullWidth size="large" color="success" variant="outlined">
                <Iconify icon="eva:facebook-fill" color="#1877F2" width={22} height={22} />
              </Button>

              <Button fullWidth size="large" color="info" variant="outlined">
                <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={22} height={22} />
              </Button>
            </Stack>
            </form>
        </Container>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
