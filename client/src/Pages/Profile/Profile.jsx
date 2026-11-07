import { Grid } from "@mui/material";
import { toast } from "react-hot-toast";
import PageHeader from "../../Components/Common/PageHeader";
import LoadingState from "../../Components/Common/LoadingState";
import ErrorState from "../../Components/Common/ErrorState";
import ProfileSummaryCard from "../../Components/Profile/ProfileSummaryCard";
import ProfileForm from "../../Components/Profile/ProfileForm";
import { useFetch } from "../../Hooks/useFetch";
import { useAsyncAction } from "../../Hooks/useAsyncAction";
import { useAuthContext } from "../../Context/AuthContext";
import { getCurrentUser } from "../../api/authApi";
import { updateUser } from "../../api/usersApi";

function Profile() {
  const { setCurrentUser } = useAuthContext();
  const { data, setData, loading, error, refetch } = useFetch(getCurrentUser, []);
  const { run, pending } = useAsyncAction();

  const handleSave = async (changes) => {
    if (Object.keys(changes).length === 0) {
      toast("Nothing to update.");
      return;
    }

    await run(() => updateUser(data.user.id, changes), {
      success: "Profile updated successfully.",
      onSuccess: (response) => {
        const user = { ...data.user, ...response.data.user };
        setData({ user });
        setCurrentUser(user);
      },
    });
  };

  return (
    <>
      <PageHeader title="My profile" subtitle="Manage your personal information." />

      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {data?.user && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <ProfileSummaryCard user={data.user} />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <ProfileForm user={data.user} saving={pending} onSave={handleSave} />
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default Profile;
