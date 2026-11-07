import { useCallback, useState } from "react";
import { Alert, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PageHeader from "../../Components/Common/PageHeader";
import LoadingState from "../../Components/Common/LoadingState";
import ErrorState from "../../Components/Common/ErrorState";
import ConfirmDialog from "../../Components/Common/ConfirmDialog";
import UserProfileCard from "../../Components/Admin/Users/UserProfileCard";
import RoleDialog from "../../Components/Admin/Users/RoleDialog";
import { useFetch } from "../../Hooks/useFetch";
import { useAsyncAction } from "../../Hooks/useAsyncAction";
import { useCategoryOptions } from "../../Hooks/useCategoryOptions";
import { useAuthContext } from "../../Context/AuthContext";
import { deleteUser, getUser, updateSpecialties, updateUserRole, updateUserStatus } from "../../api/usersApi";

function ActionRow({ title, description, children }) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      sx={{ justifyContent: "space-between", alignItems: { sm: "center" }, py: 2, borderBottom: 1, borderColor: "divider", "&:last-child": { borderBottom: 0 } }}
    >
      <div>
        <Typography fontWeight={700}>{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </div>
      {children}
    </Stack>
  );
}

function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuthContext();
  const fetchUser = useCallback(() => getUser(id), [id]);
  const { data, setData, loading, error, refetch } = useFetch(fetchUser, [fetchUser]);
  const { options: categoryOptions } = useCategoryOptions();
  const { run, pending } = useAsyncAction();
  const [dialog, setDialog] = useState(null);

  if (loading) {
    return <LoadingState message="Loading user..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  const user = data.user;
  const isSelf = String(user.id) === String(currentUser?.id);
  const apply = (response) => {
    setData({ user: { ...user, ...response.data.user } });
    setDialog(null);
  };

  const saveRole = (values) =>
    run(
      () =>
        dialog === "specialties"
          ? updateSpecialties(user.id, values.specialties)
          : updateUserRole(user.id, {
              role: values.role,
              ...(values.role === "agronomist" ? { specialties: values.specialties } : {}),
            }),
      { onSuccess: apply },
    );

  const toggleStatus = () => run(() => updateUserStatus(user.id, !user.is_active), { onSuccess: apply });

  const remove = () => run(() => deleteUser(user.id), { onSuccess: () => navigate("/admin/users", { replace: true }) });

  return (
    <>
      <PageHeader title={user.name} breadcrumbs={[{ label: "Users", to: "/admin/users" }, { label: user.name }]} />

      {isSelf && (
        <Alert severity="info" sx={{ mb: 3, borderRadius: 3 }}>
          This is your own account. You cannot change your role, deactivate or delete yourself.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5, lg: 4 }}>
          <UserProfileCard user={user} />
        </Grid>
        <Grid size={{ xs: 12, md: 7, lg: 8 }}>
          <Paper elevation={0} sx={{ px: 3, py: 1, border: 1, borderColor: "divider", borderRadius: 3 }}>
            <ActionRow title="Role" description="Farmers submit requests, agronomists answer them, admins manage everything.">
              <Button variant="outlined" startIcon={<ManageAccountsOutlinedIcon />} disabled={isSelf} onClick={() => setDialog("role")}>
                Change role
              </Button>
            </ActionRow>
            {user.role === "agronomist" && (
              <ActionRow title="Specialties" description="Only requests for crops in these categories can be assigned to this agronomist.">
                <Button variant="outlined" startIcon={<WorkspacePremiumOutlinedIcon />} onClick={() => setDialog("specialties")}>
                  Edit specialties
                </Button>
              </ActionRow>
            )}
            <ActionRow
              title={user.is_active ? "Deactivate account" : "Activate account"}
              description={
                user.is_active
                  ? "The user is signed out everywhere and cannot log in. Their data is kept."
                  : "Allow this user to log in again."
              }
            >
              <Button
                variant="outlined"
                color={user.is_active ? "warning" : "success"}
                startIcon={user.is_active ? <BlockOutlinedIcon /> : <CheckCircleOutlineIcon />}
                disabled={isSelf}
                onClick={() => setDialog("status")}
              >
                {user.is_active ? "Deactivate" : "Activate"}
              </Button>
            </ActionRow>
            <ActionRow title="Delete account" description="Permanently removes the user and their requests. Prefer deactivating.">
              <Button variant="outlined" color="error" startIcon={<DeleteOutlineIcon />} disabled={isSelf} onClick={() => setDialog("delete")}>
                Delete
              </Button>
            </ActionRow>
          </Paper>
        </Grid>
      </Grid>

      <RoleDialog
        open={dialog === "role" || dialog === "specialties"}
        user={user}
        specialtiesOnly={dialog === "specialties"}
        categoryOptions={categoryOptions}
        loading={pending}
        onSubmit={saveRole}
        onClose={() => setDialog(null)}
      />
      <ConfirmDialog
        open={dialog === "status"}
        title={user.is_active ? `Deactivate ${user.name}?` : `Activate ${user.name}?`}
        message={user.is_active ? "They will be signed out immediately and won't be able to log in." : "They will be able to log in again."}
        confirmText={user.is_active ? "Deactivate" : "Activate"}
        confirmColor={user.is_active ? "warning" : "success"}
        loading={pending}
        onConfirm={toggleStatus}
        onClose={() => setDialog(null)}
      />
      <ConfirmDialog
        open={dialog === "delete"}
        title={`Delete ${user.name}?`}
        message="This permanently deletes the account and all of its requests and feedback. This cannot be undone."
        confirmText="Delete permanently"
        confirmColor="error"
        loading={pending}
        onConfirm={remove}
        onClose={() => setDialog(null)}
      />
    </>
  );
}

export default UserDetails;
