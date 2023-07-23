import {useSearchParams, useNavigate} from "react-router-dom";
import {useContext, useEffect} from "react";
import {getClaimsFromJwt} from "../services/jwtHelper.ts";
import {LocalJwt} from "../types/AuthTypes.ts";
import {AppUserContext} from "../context/StateContext.tsx";

function SocialLogin() {

    const [searchParams] = useSearchParams();

    const navigate = useNavigate();

    const { setAppUser } = useContext(AppUserContext);

    useEffect(() => {

        const accessToken = searchParams.get("access_token");

        const expiryDate = searchParams.get("expiry_date");

// @ts-ignore
        const { uid, email, given_name, family_name} = getClaimsFromJwt(accessToken);
// @ts-ignore
        const expires:string = expiryDate;
// @ts-ignore
        setAppUser({ id: uid, email, firstName: given_name, lastName: family_name, expires, accessToken });
        const localJwt:LocalJwt ={
// @ts-ignore
            accessToken,
            expires
        }

        localStorage.setItem("upcrawler_user",JSON.stringify(localJwt));

        navigate("/");

        console.log(email);

        console.log(given_name);

        console.log(family_name);


    },[]);

    return (
        <div></div>
    );
}

export default SocialLogin;