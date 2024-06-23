import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import axios from 'axios';
import { PROPS_AUTHEN, PROPS_NIKCNAME, PROPS_PROFILE } from '../types';


const apiUrl = process.env.REACT_APP_DEV_API_URL

//ログイン用
export const fetchAsyncLogin = createAsyncThunk(
  'auth/post',
  async (authen: PROPS_AUTHEN) => {
    const res = await axios.post(`${apiUrl}authen/jwt/create`, authen, {
        headers: {
            "Contents": "application/json",
        },
    });
    return res.data;
  }
);

//新規登録用
export const fetchAsyncRegister = createAsyncThunk(
  'auth/register',
  async (authen: PROPS_AUTHEN) => {
    const res = await axios.post(`${apiUrl}api/register`, authen, {
        headers: {
            "Contents": "application/json",
        },
    });
    return res.data;
  }
);

export const fetchAsyncCreateProf = createAsyncThunk(   //最初のプロフィール作成を行う
  'profile/post',
  async (authen: PROPS_NIKCNAME) => {
    const res = await axios.post(`${apiUrl}api/profile`, authen, {
        headers: {
            "Contents": "application/json",
            Authorization: `JWT ${localStorage.localJWT}`,   //トークンを取得していないとアクセスできない
        },
    });
    return res.data;
  }
);

export const fetchAsyncUpdateProf = createAsyncThunk(
  "profile/put",
  async (profile: PROPS_PROFILE) => {
    const uploadData = new FormData();
    uploadData.append("nickName", profile.nickName);
    profile.img && uploadData.append("img", profile.img, profile.img.name);
    const res = await axios.put(
      `${apiUrl}api/profile/${profile.id}/`,
      uploadData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

export const fetchAsyncGetMyProf = createAsyncThunk(
    "profile/get",
    async () => {
  const res = await axios.get(`${apiUrl}api/myprofile/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data[0];
});

export const fetchAsyncGetProfs = createAsyncThunk(
    "profiles/get",
    async () => {
  const res = await axios.get(`${apiUrl}api/profile/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data;
});



export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    openSignIn: true,   //ログインモーダル
    openSignUp: false,  //新規登録モーダル
    openProfile: false,  //profile編集モーダル
    isLoadingAuth: false,   //バックエンドのAPIにアクセス中
    myprofile: {
        id: 0,
        nickName: "",
        userProfile: 0,
        created_on: "",
        img: "",
    },
    profiles: [
        {
            id: 0,
            nickName: "",
            userProfile: 0,
            created_on: "",
            img: "",
        },
    ]
  },
  reducers: {    //componentから呼ばれたらすぐ処理が実行される
    fetchCredStart(state) {
        state.isLoadingAuth = true;
    },
    fetchCredEnd(state) {
        state.isLoadingAuth = false;
    },
    setOpenSignIn(state) {
        state.openSignIn = true;
    },
    resetOpenSignIn(state) {
        state.openSignIn = false;
    },
    setOpenSignUp(state) {
        state.openSignUp = true;
    },
    resetOpenSignUp(state) {
        state.openSignUp = false;
    },
    setOpenProfile(state) {
        state.openProfile = true;
    },
    resetOpenProfile(state) {
        state.openProfile = false;
    },
    editNickName(state, action) {
        state.myprofile.nickName = action.payload;
    },
  },
  extraReducers: (builder) => {      //componentから呼ばれたら,その処理(createAsyncThunkで定義した関数)の状態によって実行される
    builder
      .addCase(fetchAsyncLogin.fulfilled, (state, action) => {
        localStorage.setItem('localJWT', action.payload.access);
      });
    builder
      .addCase(fetchAsyncCreateProf.fulfilled, (state, action) => {
        state.myprofile = action.payload;
      });
    builder.addCase(fetchAsyncGetMyProf.fulfilled, (state, action) => {
      state.myprofile = action.payload;
    });
    builder.addCase(fetchAsyncGetProfs.fulfilled, (state, action) => {
      state.profiles = action.payload;
    });
    builder.addCase(fetchAsyncUpdateProf.fulfilled, (state, action) => {
      state.myprofile = action.payload;
      state.profiles = state.profiles.map((prof) =>
        prof.id === action.payload.id ? action.payload : prof
      );
    });
      
  },
});

export const { fetchCredStart, fetchCredEnd, setOpenSignIn, resetOpenSignIn, setOpenSignUp, resetOpenSignUp, setOpenProfile, resetOpenProfile, editNickName } = authSlice.actions;

export const selectIsLoadingAuth = (state: RootState) =>
  state.auth.isLoadingAuth;
export const selectOpenSignIn = (state: RootState) => state.auth.openSignIn;
export const selectOpenSignUp = (state: RootState) => state.auth.openSignUp;
export const selectOpenProfile = (state: RootState) => state.auth.openProfile;
export const selectProfile = (state: RootState) => state.auth.myprofile;
export const selectProfiles = (state: RootState) => state.auth.profiles;

export default authSlice.reducer;