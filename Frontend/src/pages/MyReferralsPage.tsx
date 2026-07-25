import { useEffect, useState } from "react";
import { Users, Mail, Phone } from "lucide-react";
import { getMyReferrals } from "../services/referralService";

interface Referral {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  profileImage?: string;
  createdAt: string;
}

export default function MyReferralsPage() {
  const [loading, setLoading] =
    useState(true);

  const [count, setCount] =
    useState(0);

  const [referrals, setReferrals] =
    useState<Referral[]>([]);

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      const res =
        await getMyReferrals();

      setCount(res.count || 0);

      setReferrals(
        res.referrals || []
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">

      {/* Header */}
      <div className="mb-6">

        <h1 className="text-2xl font-bold text-gray-800">
          My Referrals
        </h1>

        <p className="text-gray-500">
          View your direct referral team
        </p>

      </div>

      {/* Total Referrals */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
            <Users
              size={28}
              className="text-green-600"
            />
          </div>

          <div>
            <p className="text-gray-500">
              Total Referrals
            </p>

            <h2 className="text-3xl font-bold text-green-600">
              {count}
            </h2>
          </div>

        </div>

      </div>

      {loading ? (
        <div className="text-center py-10">
          Loading referrals...
        </div>
      ) : referrals.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-10 text-center">
          <Users
            size={40}
            className="mx-auto mb-3 text-gray-400"
          />

          <h3 className="font-semibold text-lg">
            No Referrals Yet
          </h3>

          <p className="text-gray-500">
            Start sharing your referral
            link to grow your team.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

          {referrals.map(
            (referral) => (
              <div
                key={referral._id}
                className="
                  bg-white
                  rounded-2xl
                  shadow
                  p-5
                  hover:shadow-lg
                  transition
                "
              >
                <div className="flex items-center gap-4">

                  <img
                    src={
                      referral.profileImage ||
                      "https://ui-avatars.com/api/?name=" +
                        referral.name
                    }
                    alt={referral.name}
                    className="
                      w-16
                      h-16
                      rounded-full
                      object-cover
                      border
                    "
                  />

                  <div>
                    <h3 className="font-semibold text-lg">
                      {referral.name}
                    </h3>

                    <p className="text-xs text-gray-500">
                      Joined{" "}
                      {new Date(
                        referral.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>

                </div>

                <div className="mt-4 space-y-2">

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={15} />
                    {referral.email}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={15} />
                    {referral.mobile}
                  </div>

                </div>
              </div>
            )
          )}

        </div>
      )}

    </div>
  );
}