import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";



export const baseURL = "https://sm-server.netlify.app/api";

export const baseEmployeesApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      headers.set("x-token", `vanessa&radostina`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getEmployees: builder.query<any,void>({
        
      query: () => "/get_all_employees_data_from_bob", // Specify the actual query string or path to fetch employees' data
      transformResponse: (response: any)=>{
        return response.employees
      }
    }),
  }),
  keepUnusedDataFor: 0,
  refetchOnMountOrArgChange: true,
});

export const { useGetEmployeesQuery } = baseEmployeesApi;


// export const baseURL =
//   "api/get_all_employees_data_from_bob";

  
//   export const baseApi = createApi({
//     reducerPath: "baseApi",
//     baseQuery: fetchBaseQuery({
//       baseUrl: baseURL,
//       prepareHeaders: (headers) => {
//       headers.set("x-token", `vanessa&radostina`);
//       return headers;
//     },
//   }),
//   endpoints: () => ({}),
//   keepUnusedDataFor: 0,
//   refetchOnMountOrArgChange: true,
// });