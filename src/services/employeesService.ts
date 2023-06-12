import { baseEmployeesApi } from "../utils/baseEmployeesApi";

const GetEmployees = "getEmployees";

const employeesService = baseEmployeesApi.injectEndpoints({
  endpoints: (builder) => ({
    [GetEmployees]: builder.query({
      query: () => "",
    }),
  }),
});

export const { useGetEmployeesQuery } = employeesService;
