import { useGoogleLogin } from '@react-oauth/google';
import GoogleIcon from '@/icons/GoogleIcon';
import shareVideo from '@/assets/share.mp4';
import logo from '@/assets/logowhite.png';
import { useState } from 'react';
import { IGoogleUserInfo } from '@/types/google';
import { client } from '@/client';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isGoogleLoginLoading, setIsGoogleLoginLoading] =
    useState<boolean>(false);

  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoginLoading(false);

      const userInfo: IGoogleUserInfo = await fetch(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        }
      )
        .then((res) => res.json())
        .catch((err) => console.log(err));

      const userId = crypto.randomUUID();
      userInfo._id = userId;
      localStorage.setItem('user', JSON.stringify(userInfo));

      const { name, picture } = userInfo;

      const doc = {
        _id: userId,
        _type: 'user',
        userName: name,
        image: picture,
      };

      client
        .createIfNotExists(doc)
        .then(() => navigate('/', { replace: true }))
        .catch((err) => console.log(err));
    },
    onError: (errorResponse) => {
      setIsGoogleLoginLoading(false);
      console.log(errorResponse);
    },
  });

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        >
          <source src={shareVideo} type="video/mp4" />
        </video>

        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo} width={130} alt="logo" />
          </div>

          <div className="shadow-2xl">
            <button
              type="button"
              onClick={() => {
                setIsGoogleLoginLoading(true);
                login();
              }}
              className="bg-mainColor flex gap-4 justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
              disabled={isGoogleLoginLoading}
            >
              <GoogleIcon />
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
