// import { useSearchParams, useNavigate, useLocation } from "react-router-dom";

// export function useReturnTo(defaultPath = "/dashboard") {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const location = useLocation();

//   // 1. Get the return target from URL params
//   const returnToPath = searchParams.get("returnTo") || defaultPath;

//   // 2. Redirect the user to the saved path
//   const redirectToTarget = () => {
//     navigate(returnToPath, { replace: true });
//   };

//   // 3. Generate a query string for the current page to pass to the login link
//   const getLoginQueryString = () => {
//     const currentPath = encodeURIComponent(location.pathname + location.search);
//     return `?returnTo=${currentPath}`;
//   };

//   return {
//     returnToPath,
//     redirectToTarget,
//     getLoginQueryString,
//   };
// }
