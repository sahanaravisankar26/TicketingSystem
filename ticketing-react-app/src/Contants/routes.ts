export const Routes = {
  LoginSignup: "/",
  AdminLogin: "/admin-login",
  AdminDashboard: "/admin-dashboard",
  History: "/history",
  Issue: "/issue",
  Dashboard: "/dashboard",
  All: "*",
  AllPossible: "/*",
  SignInAll: "/sign-in/*",
  SignIn: "/sign-in",
  AdminLoginAll: "/admin-login/*",
};

export const APIEndpoints = {
  AdminGetAllTicketsEndpoint: "http://localhost:8080/fetch-all-tickets",
  UserLoginEndpoint: "http://localhost:8080/login",
  UserSignupEndpoint: "http://localhost:8080/signup",
  AdminUpdateTicketEndpoint: "http://localhost:8080/admin-updates",
  DeleteTicketEndpoint: "http://localhost:8080/delete-support",
  UpdateTicketEndpoint: "http://localhost:8080/update-support",
  SubmitIssueTicketEndpoint: "http://localhost:8080/submit-issue",
  GetUserPageEndpoint: "http://localhost:8080/protected",
};

export const FetchUserHistoryEndpoint = (email: string) =>
  `http://localhost:8080/fetch-history?email=${encodeURIComponent(email)}`;
