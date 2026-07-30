import { useEffect, useState } from "react";
import {
  getProfile,
  updateProfile,
  changePassword
} from "../services/profileService";

interface User {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  profileImage?: string;

  referralCode: string;

  directReferrals?: any[];

  totalReferrals: number;
  totalEarnings: number;
  walletBalance: number;

  level: number;

  isActive: boolean;

  role: string;

  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  upiId?: string;

accountHolderName?: string;
bankName?: string;
accountNumber?: string;
ifscCode?: string;

  createdAt: string;

  referredBy?: {
    _id: string;
    name: string;
    email: string;
  };
}


export default function ProfilePage() {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

    const [showEditModal, setShowEditModal] =
  useState(false);

  const [passwordError, setPasswordError] =
  useState("");
  
const [formData, setFormData] =
  useState({
    name: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",

    upiId: "",
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",

    profileImage: null as File | null,
  });
  const [
  showPasswordModal,
  setShowPasswordModal,
] = useState(false);

const [
  passwordData,
  setPasswordData,
] = useState({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

  const fetchProfile =
    async () => {
      try {
        const data =
          await getProfile();

        setUser(data.user);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchProfile();
  }, []);


  const handleEditClick = () => {
  if (!user) return;

 setFormData({
  name: user.name || "",
  mobile: user.mobile || "",
  address: user.address || "",
  city: user.city || "",
  state: user.state || "",
  pincode: user.pincode || "",

  upiId: user.upiId || "",

  accountHolderName:
    user.accountHolderName || "",

  bankName:
    user.bankName || "",

  accountNumber:
    user.accountNumber || "",

  ifscCode:
    user.ifscCode || "",

  profileImage: null,
});

  setShowEditModal(true);
};

  if (loading) {
    return (
      <div className="p-6">
        Loading Profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        User not found
      </div>
    );
  }

  const referralLink =
  `${window.location.origin}/signup?ref=${user.referralCode}`;

  const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(
      referralLink
    );

    alert("Referral link copied");
  } catch (error) {
    console.log(error);
  }
};

const handleWhatsappShare = () => {
  const text =
    `🌱 Join Green Planet using my referral link:\n\n${referralLink}`;

  const url =
    `https://wa.me/?text=${encodeURIComponent(text)}`;

  window.open(url, "_blank");
};



const handleProfileUpdate =
  async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const data =
        new FormData();

      data.append(
        "name",
        formData.name
      );

      data.append(
        "mobile",
        formData.mobile
      );

      data.append(
        "address",
        formData.address
      );

      data.append(
        "city",
        formData.city
      );

      data.append(
        "state",
        formData.state
      );

      data.append(
        "pincode",
        formData.pincode
      );

      data.append(
          "upiId",
          formData.upiId
        );

        data.append(
          "accountHolderName",
          formData.accountHolderName
        );

        data.append(
          "bankName",
          formData.bankName
        );

        data.append(
          "accountNumber",
          formData.accountNumber
        );

        data.append(
          "ifscCode",
          formData.ifscCode
        );

      if (
        formData.profileImage
      ) {
        data.append(
          "profileImage",
          formData.profileImage
        );
      }

      await updateProfile(data);

      setShowEditModal(false);

      fetchProfile();
    } catch (error) {
      console.log(error);
    }
  };


  const handleChangePassword =
  async () => {
    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      setPasswordError(
        "Passwords do not match"
      );
      return;
    }

    setPasswordError("");

    try {
      await changePassword({
        currentPassword:
          passwordData.currentPassword,
        newPassword:
          passwordData.newPassword,
      });

      alert(
        "Password changed successfully"
      );

      setShowPasswordModal(false);

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">

      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          My Profile
        </h1>

        <p className="text-gray-500">
          Manage account information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow border p-6">

          <div className="flex flex-col items-center">

            <img
              src={
                user.profileImage ||
                `https://ui-avatars.com/api/?name=${user.name}`
              }
              alt={user.name}
              className="
                w-32
                h-32
                rounded-full
                object-cover
                border-4
                border-green-100
              "
            />

            <h2 className="mt-4 text-2xl font-bold">
              {user.name}
            </h2>

            <p className="text-gray-500">
              {user.email}
            </p>

            <span
              className="
                mt-3
                px-4
                py-1
                rounded-full
                bg-green-100
                text-green-700
                text-sm
              "
            >
              {user.role}
            </span>
           <button
  onClick={handleEditClick}
  className="
    mt-4
    px-5
    py-2
    bg-blue-600
    text-white
    rounded-xl
  "
>
  Edit Profile
</button>
          </div>

          <div
  className="
    bg-white
    rounded-3xl
    shadow
    border
    p-6
    mt-6
  "
>
  <h3 className="text-lg font-bold mb-4">
    Referral Program
  </h3>

  <div className="space-y-3">

    <div>
      <p className="text-sm text-gray-500">
        Referral Code
      </p>

      <p className="font-bold text-lg">
        {user.referralCode}
      </p>
    </div>

    <div>
      <p className="text-sm text-gray-500">
        Referral Link
      </p>

      <div
        className="
          bg-gray-100
          p-3
          rounded-xl
          break-all
          text-sm
        "
      >
        {referralLink}
      </div>
    </div>

    <div className="flex gap-3">
      <button
        onClick={handleCopy}
        className="
          flex-1
          bg-blue-600
          text-white
          py-3
          rounded-xl
        "
      >
        Copy Link
      </button>

      <button
        onClick={handleWhatsappShare}
        className="
          flex-1
          bg-green-600
          text-white
          py-3
          rounded-xl
        "
      >
        WhatsApp
      </button>
    </div>

  </div>
</div>

        </div>

        {/* Info */}
        <div className="lg:col-span-2 space-y-6">

          <div className="bg-white rounded-3xl shadow border p-6">

            <h3 className="text-xl font-bold mb-5">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <Info
                label="Name"
                value={user.name}
              />

              <Info
                label="Email"
                value={user.email}
              />

              <Info
                label="Mobile"
                value={
                  user.mobile || "-"
                }
              />

              <Info
                label="Referral Code"
                value={
                  user.referralCode
                }
              />

              <Info
                label="Address"
                value={
                  user.address || "-"
                }
              />

              <Info
                label="City"
                value={
                  user.city || "-"
                }
              />

              <Info
                label="State"
                value={
                  user.state || "-"
                }
              />

              <Info
                label="Pincode"
                value={
                  user.pincode || "-"
                }
              />

            </div>

          </div>
          


          <div className="bg-white rounded-3xl shadow border p-6">
            <div className="mb-4 p-3 rounded-xl bg-green-50 text-green-700">
            {user.upiId ||
            user.accountNumber
              ? "✓ Withdrawal details configured"
              : "⚠ Please add withdrawal details before requesting withdrawals"}
          </div>
            <h3 className="text-xl font-bold mb-5">
              Withdrawal Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <Info
                label="UPI ID"
                value={user.upiId || "-"}
              />

              <Info
                label="Account Holder"
                value={
                  user.accountHolderName || "-"
                }
              />

              <Info
                label="Bank Name"
                value={
                  user.bankName || "-"
                }
              />

              <Info
                label="Account Number"
                value={
                  user.accountNumber || "-"
                }
              />

              <Info
                label="IFSC Code"
                value={
                  user.ifscCode || "-"
                }
              />

            </div>

          </div>

          <div className="bg-white rounded-3xl shadow border p-6">
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-xl font-bold">
        Security
      </h3>

      <p className="text-gray-500 text-sm mt-1">
        Change your account password
      </p>
    </div>

    <button
      onClick={() => setShowPasswordModal(true)}
      className="
        px-5
        py-2
        bg-red-600
        text-white
        rounded-xl
      "
    >
      Change Password
    </button>
  </div>
</div>
          {/* Statistics */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

  <StatCard
    title="Direct Referrals"
    value={
      user.directReferrals?.length || 0
    }
  />

  <StatCard
    title="Total Team"
    value={user.totalReferrals}
  />

  <StatCard
    title="Earnings"
    value={`₹${user.totalEarnings}`}
  />

  <StatCard
    title="Wallet"
    value={`₹${user.walletBalance}`}
  />

</div>


          <div className="bg-white rounded-3xl shadow border p-6">

  <h3 className="text-xl font-bold mb-5">
    Network Summary
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

    <Info
      label="Sponsor"
      value={
        user.referredBy?.name ||
        "Root Admin"
      }
    />

    <Info
      label="Level"
      value={user.level}
    />

    <Info
      label="Direct Referrals"
      value={
        user.directReferrals?.length || 0
      }
    />

    <Info
      label="Status"
      value={
        user.isActive
          ? "Active"
          : "Inactive"
      }
    />

  </div>

</div>



<div className="bg-white rounded-3xl shadow border p-6">

  <h3 className="text-xl font-bold mb-5">
    Recent Referrals
  </h3>

  {user.directReferrals &&
  user.directReferrals.length > 0 ? (

    <div className="space-y-4">

      {user.directReferrals
        .slice(0, 5)
        .map((ref: any) => (

          <div
            key={ref._id}
            className="
              flex
              items-center
              justify-between
              border-b
              pb-3
            "
          >
            <div>
              <p className="font-medium">
                {ref.name}
              </p>

              <p className="text-sm text-gray-500">
                {ref.email}
              </p>
            </div>

            <span
              className="
                text-xs
                bg-green-100
                text-green-700
                px-3
                py-1
                rounded-full
              "
            >
              Joined
            </span>

          </div>

        ))}

    </div>

  ) : (

    <p className="text-gray-500">
      No referrals yet
    </p>

  )}

</div>
        </div>

      </div>
      {showEditModal && (
  <div
    className="
      fixed inset-0
      bg-black/50
      flex items-center
      justify-center
      z-50
      p-4
    "
  >
    <div
      className="
        bg-white
        rounded-3xl
        w-full
        max-w-2xl
        p-6
        max-h-[90vh]
        overflow-y-auto
      "
    >
      <h2 className="text-2xl font-bold mb-6">
        Edit Profile
      </h2>

      <form
        onSubmit={
          handleProfileUpdate
        }
        className="space-y-4"
      >
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({
              ...formData,
              name:
                e.target.value,
            })
          }
          className="
            w-full
            border
            rounded-xl
            p-3
          "
        />

        <input
          type="text"
          placeholder="Mobile"
          value={formData.mobile}
          onChange={(e) =>
            setFormData({
              ...formData,
              mobile:
                e.target.value,
            })
          }
          className="
            w-full
            border
            rounded-xl
            p-3
          "
        />

        <textarea
          placeholder="Address"
          value={
            formData.address
          }
          onChange={(e) =>
            setFormData({
              ...formData,
              address:
                e.target.value,
            })
          }
          className="
            w-full
            border
            rounded-xl
            p-3
          "
        />

        <div className="grid md:grid-cols-3 gap-4">

          <input
            type="text"
            placeholder="City"
            value={formData.city}
            onChange={(e) =>
              setFormData({
                ...formData,
                city:
                  e.target.value,
              })
            }
            className="
              border
              rounded-xl
              p-3
            "
          />

          <input
            type="text"
            placeholder="State"
            value={formData.state}
            onChange={(e) =>
              setFormData({
                ...formData,
                state:
                  e.target.value,
              })
            }
            className="
              border
              rounded-xl
              p-3
            "
          />

          <input
            type="text"
            placeholder="Pincode"
            value={
              formData.pincode
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                pincode:
                  e.target.value,
              })
            }
            className="
              border
              rounded-xl
              p-3
            "
          />

        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFormData({
              ...formData,
              profileImage:
                e.target
                  .files?.[0] ||
                null,
            })
          }
        />

        {formData.profileImage && (
          <img
            src={URL.createObjectURL(
              formData.profileImage
            )}
            className="
              w-24
              h-24
              rounded-full
              object-cover
              border
            "
          />
        )}


        <div className="border-t pt-5">

  <h3 className="font-bold text-lg mb-4">
    Withdrawal Details
  </h3>

  <div className="grid md:grid-cols-2 gap-4">

    <input
      type="text"
      placeholder="UPI ID"
      value={formData.upiId}
      onChange={(e) =>
        setFormData({
          ...formData,
          upiId: e.target.value,
        })
      }
      className="border rounded-xl p-3"
    />

    <input
      type="text"
      placeholder="Account Holder Name"
      value={
        formData.accountHolderName
      }
      onChange={(e) =>
        setFormData({
          ...formData,
          accountHolderName:
            e.target.value,
        })
      }
      className="border rounded-xl p-3"
    />

    <input
      type="text"
      placeholder="Bank Name"
      value={formData.bankName}
      onChange={(e) =>
        setFormData({
          ...formData,
          bankName: e.target.value,
        })
      }
      className="border rounded-xl p-3"
    />

    <input
      type="text"
      placeholder="Account Number"
      value={
        formData.accountNumber
      }
      onChange={(e) =>
        setFormData({
          ...formData,
          accountNumber:
            e.target.value,
        })
      }
      className="border rounded-xl p-3"
    />

    <input
      type="text"
      placeholder="IFSC Code"
      value={formData.ifscCode}
      onChange={(e) =>
        setFormData({
          ...formData,
          ifscCode: e.target.value,
        })
      }
      className="border rounded-xl p-3"
    />

  </div>

</div>

        <div className="flex gap-3 justify-end pt-3">

          <button
            type="button"
            onClick={() =>
              setShowEditModal(
                false
              )
            }
            className="
              px-5
              py-2
              border
              rounded-xl
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            className="
              px-5
              py-2
              bg-green-600
              text-white
              rounded-xl
            "
          >
            Update Profile
          </button>

        </div>

      </form>
    </div>
  </div>
)}

{showPasswordModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-3xl w-full max-w-md p-6">
      <h2 className="text-2xl font-bold mb-5">
        Change Password
      </h2>

      <div className="space-y-4">

        <input
          type="password"
          placeholder="Current Password"
          value={passwordData.currentPassword}
          onChange={(e) =>
            setPasswordData({
              ...passwordData,
              currentPassword:
                e.target.value,
            })
          }
          className="w-full border rounded-xl p-3"
        />

        <input
          type="password"
          placeholder="New Password"
          value={passwordData.newPassword}
          onChange={(e) =>
            setPasswordData({
              ...passwordData,
              newPassword:
                e.target.value,
            })
          }
          className="w-full border rounded-xl p-3"
        />

       <input
  type="password"
  placeholder="Confirm Password"
  value={passwordData.confirmPassword}
  onChange={(e) => {
    const value = e.target.value;

    setPasswordData({
      ...passwordData,
      confirmPassword: value,
    });

    if (
      passwordData.newPassword &&
      value !== passwordData.newPassword
    ) {
      setPasswordError(
        "Passwords do not match"
      );
    } else {
      setPasswordError("");
    }
  }}
  className="w-full border rounded-xl p-3"
/>

{passwordError && (
  <p className="text-red-500 text-sm mt-1">
    {passwordError}
  </p>
)}
      </div>

      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={() =>
            setShowPasswordModal(false)
          }
          className="px-5 py-2 border rounded-xl"
        >
          Cancel
        </button>

        <button
          onClick={handleChangePassword}
          className="px-5 py-2 bg-red-600 text-white rounded-xl"
        >
          Update Password
        </button>

      </div>
    </div>
  </div>
)}

    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div>
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="font-semibold">
        {value}
      </p>


      
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="bg-sky-50 rounded-2xl p-4 text-center">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h3 className="text-xl font-bold mt-1">
        {value}
      </h3>
    </div>
  );
}