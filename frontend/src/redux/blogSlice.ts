import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface BlogState {
  selectedBlogId: string | null;
  selectedCommentId: string | null;
}

const initialState: BlogState = {
  selectedBlogId: null,
  selectedCommentId: null,
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setSelectedBlogId: (state, action: PayloadAction<string | null>) => {
      state.selectedBlogId = action.payload;
    },
  },
});

export const { setSelectedBlogId } = blogSlice.actions;
export default blogSlice.reducer;
