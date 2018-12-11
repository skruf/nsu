export default (state) => ({
  limit: state.pageSize,
  skip: (state.pageCurrent - 1) * state.pageSize,
  sort: state.sortBy,
  search: {
    fields: state.searchFilterFields,
    value: state.searchFilterValue || null
  }
})
