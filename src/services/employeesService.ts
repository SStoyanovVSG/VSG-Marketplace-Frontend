import { baseApi } from "../utils/baseEmployeesApi";

const GetEmployees = "getEmployees";

const employeesService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    [GetEmployees]: builder.query({
      query: () => "",
    }),
  }),
});

export const { useGetEmployeesQuery } = employeesService;
