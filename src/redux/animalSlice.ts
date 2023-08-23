import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./configstore";

export const URL =
  "https://openapi.gg.go.kr/AbdmAnimalProtect?KEY=029f99a01fbb42dba52abb947db9975e&Type=json";

export interface Animal {
  SIGUN_CD: number;
  SIGUN_NM: string;
  ABDM_IDNTFY_NO: number;
  THUMB_IMAGE_COURS: string;
  RECEPT_DE: string;
  DISCVRY_PLC_INFO: string;
  SPECIES_NM: string;
  COLOR_NM: string;
  AGE_INFO: string;
  BDWGH_INFO: string;
  PBLANC_IDNTFY_NO: string;
  PBLANC_BEGIN_DE: number;
  PBLANC_END_DE: number;
  IMAGE_COURS: string;
  STATE_NM: string;
  SEX_NM: string;
  NEUT_YN: string;
  SFETR_INFO: string;
  SHTER_NM: string;
  SHTER_TELNO: number;
  PROTECT_PLC: string;
  JURISD_INST_NM: string;
  CHRGPSN_NM: null | string;
  CHRGPSN_CONTCT_NO: null | string;
  PARTCLR_MATR: null | string;
  REFINE_LOTNO_ADDR: string;
  REFINE_ROADNM_ADDR: string;
  REFINE_ZIP_CD: number;
  REFINE_WGS84_LOGT: number;
  REFINE_WGS84_LAT: number;
}

// AnimalState 인터페이스 정의
interface AnimalState {
  animals: Animal[];
  loading: boolean;
  error: string | null;
}

const initialState: AnimalState = {
  animals: [],
  loading: false,
  error: null,
};

const animalSlice = createSlice({
  name: "animals",
  initialState,
  reducers: {
    fetchAnimalsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchAnimalsSuccess(state, action: PayloadAction<Animal[]>) {
      state.animals = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchAnimalsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchAnimalsStart, fetchAnimalsSuccess, fetchAnimalsFailure } =
  animalSlice.actions;

// Selector 함수 정의
export const selectAnimals = (state: RootState) => state.animals.animals;
export const selectLoading = (state: RootState) => state.animals.loading;
export const selectError = (state: RootState) => state.animals.error;

export default animalSlice.reducer;
