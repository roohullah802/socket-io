import {
  fetchBaseQuery,
  createApi,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { setToken, setUser } from "./user.reducer";

interface LocalRootState {
  user: {
    token: string | null;
  };
}

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000/graphql",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as LocalRootState).user.token;
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  const isMeNull = (result.data as any)?.data?.me === null;

  if (isMeNull) {
    const refreshResult: any = await baseQuery(
      {
        url: "",
        body: {
          query: `mutation { refresh { id email accessToken } }`,
        },
        method: "POST",
      },
      api,
      extraOptions,
    );

    if (refreshResult.data?.data?.refresh?.accessToken) {
      const token = refreshResult.data.data.refresh.accessToken;
      const data = {
        id: refreshResult.data.data.refresh.id,
        email: refreshResult.data.data.refresh.email,
      };
      api.dispatch(setUser(data));
      api.dispatch(setToken(token));

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(setUser(null));
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    me: builder.query({
      query: () => ({
        url: "",
        method: "POST",
        body: {
          query: `
          query { me { id email } }
          `,
        },
        transformResponse: (response: {
          data: { data: { me: { id: string; email: string } | null } };
        }) => response.data.data,
      }),
    }),

    logOutt: builder.mutation<unknown, void>({
      query: () => ({
        url: "",
        method: "POST",
        body: {
          query: `
          mutation Logout { logout }
          `,
        },
      }),
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: "",
        method: "POST",
        body: {
          query: `
            mutation Login($email: String!, $password: String!){
              userLogin(email: $email, password: $password){
              id
              email
              accessToken
              }
            }
  
            `,
          variables: credentials,
        },
        transformResponse: (response: {
          data: {
            data: {
              userLogin: { id: string; email: string; accessToken: string };
            };
          };
        }) => response.data.data,
      }),
    }),

    register: builder.mutation({
      query: (credentials) => ({
        url: "",
        method: "POST",
        body: {
          query: `
            mutation UserRegister($username: String!, $email: String!, $password: String!) {
              userRegister(username: $username, email: $email, password: $password) {
                id
                username
                email
              }
            }
          `,
          variables: credentials,
        },
      }),
    }),

    getAllUsers: builder.query({
      query: () => ({
        url: "",
        method: "POST",
        body: {
          query: `
          query GetAllUsers {
            getAllUsers {
              id
              username
            }
          }
          
          `,
        },
        // transformResponse: (response: any) => response,
      }),
    }),

    getAllMessages: builder.query({
      query: (receiverId: string) => ({
        url: "",
        method: "POST",
        body: {
          query: `
            query GetAllMessages($receiverId: String!) {
                  getAllMessages(receiverId: $receiverId) {
                    id
                    receiverId
                    senderId
                    content
                    seen
                    image
                  }
                }

          `,
          variables: { receiverId },
        },
      }),
    }),

    sendMessage: builder.mutation({
      query: (credentials) => ({
        url: "",
        method: "POST",
        body: {
          query: `
           mutation SendMessage($receiverId: String!, $senderId: String!, $content: String!) {
              sendMessage(receiverId: $receiverId, senderId: $senderId, content: $content) {
                id
                receiverId
                senderId
                content
              }
            }
          `,
          variables: credentials,
        },
      }),
    }),
  }),
});

export const {
  useMeQuery,
  useLogOuttMutation,
  useLoginMutation,
  useRegisterMutation,
  useGetAllUsersQuery,
  useGetAllMessagesQuery,
  useSendMessageMutation,
} = apiSlice;
