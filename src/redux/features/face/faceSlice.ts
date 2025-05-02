import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FaceData {
  age: number;
  gender: string;
  expressions: Record<string, number>;
  box: { x: number; y: number; width: number; height: number };
}

interface FaceState {
  webcamOn: boolean;
  loading: boolean;
  faces: FaceData[];
}

const initialState: FaceState = {
  webcamOn: false,
  loading: false,
  faces: [],
};

const faceSlice = createSlice({
  name: "face",
  initialState,
  reducers: {
    setWebcamStatus: (state, action: PayloadAction<boolean>) => {
      state.webcamOn = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setFaces: (state, action: PayloadAction<FaceData[]>) => {
      state.faces = action.payload;
    },
  },
});

export const { setWebcamStatus, setLoading, setFaces } = faceSlice.actions;
export default faceSlice.reducer;
