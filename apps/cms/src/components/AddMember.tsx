// import React, { useState } from "react";
// import { registerTeamMember, RegisterMemberPayload } from "../../config/team";

// export default function AddMember() {
//   const [formData, setFormData] = useState<RegisterMemberPayload>({
//     name: "",
//     email: "",
//     position: "",
//     password: "",
//     role: "member",
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<{
//     type: "success" | "error";
//     text: string;
//   } | null>(null);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
//   ) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage(null);

//     try {
//       await registerTeamMember(formData);
//       setMessage({
//         type: "success",
//         text: "Team member registered successfully!",
//       });
//       setFormData({
//         name: "",
//         email: "",
//         position: "",
//         password: "",
//         role: "member",
//       });
//     } catch (err: any) {
//       const errorMsg =
//         err.response?.data?.message || "Failed to register team member.";
//       setMessage({ type: "error", text: errorMsg });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       style={{
//         maxWidth: "500px",
//         margin: "2rem auto",
//         padding: "1.5rem",
//         border: "1px solid #ccc",
//         borderRadius: "8px",
//       }}>
//       <h2>Add New Team Member</h2>

//       {message && (
//         <div
//           style={{
//             padding: "0.75rem",
//             marginBottom: "1rem",
//             color: message.type === "success" ? "green" : "red",
//           }}>
//           {message.text}
//         </div>
//       )}

//       <form
//         onSubmit={handleSubmit}
//         style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
//         <div>
//           <label style={{ display: "block", marginBottom: "0.25rem" }}>
//             Name
//           </label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//             style={{ width: "100%", padding: "0.5rem" }}
//           />
//         </div>

//         <div>
//           <label style={{ display: "block", marginBottom: "0.25rem" }}>
//             Email
//           </label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             style={{ width: "100%", padding: "0.5rem" }}
//           />
//         </div>

//         <div>
//           <label style={{ display: "block", marginBottom: "0.25rem" }}>
//             Position
//           </label>
//           <input
//             type="text"
//             name="position"
//             value={formData.position}
//             onChange={handleChange}
//             required
//             style={{ width: "100%", padding: "0.5rem" }}
//           />
//         </div>

//         <div>
//           <label style={{ display: "block", marginBottom: "0.25rem" }}>
//             Password
//           </label>
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             style={{ width: "100%", padding: "0.5rem" }}
//           />
//         </div>

//         <div>
//           <label style={{ display: "block", marginBottom: "0.25rem" }}>
//             Role
//           </label>
//           <select
//             name="role"
//             value={formData.role}
//             onChange={handleChange}
//             style={{ width: "100%", padding: "0.5rem" }}>
//             <option value="member">Member</option>
//             <option value="admin">Admin</option>
//           </select>
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           style={{
//             padding: "0.75rem",
//             backgroundColor: "#0070f3",
//             color: "#fff",
//             border: "none",
//             borderRadius: "4px",
//             cursor: "pointer",
//           }}>
//           {loading ? "Adding Member..." : "Add Member"}
//         </button>
//       </form>
//     </div>
//   );
// }
