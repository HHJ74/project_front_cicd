import { configureStore, createSlice } from '@reduxjs/toolkit'


const cartSlice = createSlice({
    name: 'cart',
    initialState: [], // 배열로 설정
    reducers: {
        addItem(state, action) {
            state.push(action.payload);
        },
        updateItemQuantity: (state, action) => {
                const { product_id, quantity } = action.payload;
                const item = state.items.find(item => item.product_id === product_id);
                if (item) {
                  item.quantity = quantity;
                }
              },
        updateDiyQuantity:(state, action) =>{
          const {selected_options, quantity} = action.payload
          const item = state.items.find(item => item.selected_options === selected_options);
          if (item){
            item.quantity = quantity
          }
        },
        
    }
});
export const { addItem, updateItemQuantity, updateDiyQuantity} = cartSlice.actions





// export default cartSlice.reducer;



