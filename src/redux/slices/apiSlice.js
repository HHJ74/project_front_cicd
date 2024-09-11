import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'; // 툴킷에서 제공하는 함수를 사용하기 위해 import
import { GET_PRODUCTS_API_URL } from '../../utils/apiUrl'; // 상수를 가져오기 위해 import
import { getRequest } from '../../utils/requestMethods'; // get request 함수를 가져오기 위해 import

// 공통된 비동기 액션 생성 로직을 별도의 함수로 분리
const getItemsFetchThunk = (actionType, apiURL) => {
  return createAsyncThunk(actionType, async (product_id) => {
    // console.log(apiURL, productId);
    const fullPath = `${apiURL}/${product_id}`;
    return await getRequest(fullPath);
  });
};

export const fetchGetItemsData = getItemsFetchThunk('fetchGetItems', GET_PRODUCTS_API_URL);

const handleFulfilled = (stateKey) => (state, action) => {
  state[stateKey] = action.payload;
};

const handleRejected = (state, action) => {
  console.log('Error', action.payload);
  state.isError = true;
};

const apisSlice = createSlice({
  name: 'api',
  initialState: {
    getItemsData: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGetItemsData.fulfilled, handleFulfilled('getItemsData'))
      .addCase(fetchGetItemsData.rejected, handleRejected);
  },
});

export default apisSlice.reducer;
