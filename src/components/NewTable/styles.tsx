import { styled } from "@mui/material/styles";

export const StyledTable = styled("table")(({ theme }) => ({
  width: "100%",
  borderCollapse: "collapse",
  background: "#FFFFFF",
  fontFamily: theme.typography.fontFamily,
  "& th": {
    fontSize: 12,
    background: "black",
    color: "white",
  },
  "& td, & th": {
    textAlign: "left",
    padding: "0.2rem 1rem",
    fontSize: 14,
  },
  "& tbody tr:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const StyledTableLoader = styled("div")(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  background: "rgba(255,255,255, 0.4)",
  height: "100%",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));
