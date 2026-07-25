import { useEffect, useState } from "react";
import {
  getAllWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
  markWithdrawalPaid,
} from "../../services/withdrawalService";
import toast from "react-hot-toast";

export default function AdminWithdrawalPage() {
  const [withdrawals, setWithdrawals] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

    const [showProofModal, setShowProofModal] =
  useState(false);

const [selectedWithdrawal, setSelectedWithdrawal] =
  useState<any>(null);

const [proofFile, setProofFile] =
  useState<File | null>(null);

const [transactionId, setTransactionId] =
  useState("");

  const fetchData = async () => {
    try {
      const res =
        await getAllWithdrawals();

      if (res.success) {
        setWithdrawals(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove =
    async (id: string) => {
      try {
        await approveWithdrawal(id);

        toast.success(
          "Withdrawal Approved"
        );

        fetchData();
      } catch (error) {
        toast.error(
          "Failed to approve"
        );
      }
    };

  const handleReject =
    async (id: string) => {
      const remark =
        prompt(
          "Enter rejection reason"
        ) || "";

      try {
        await rejectWithdrawal(
          id,
          remark
        );

        toast.success(
          "Withdrawal Rejected"
        );

        fetchData();
      } catch (error) {
        toast.error(
          "Failed to reject"
        );
      }
    };

  const handlePaidSubmit =
  async () => {
    try {
      if (!proofFile) {
        toast.error(
          "Please upload proof image"
        );
        return;
      }

      const formData =
        new FormData();

      formData.append(
        "proof",
        proofFile
      );

      formData.append(
        "transactionId",
        transactionId
      );

      await markWithdrawalPaid(
        selectedWithdrawal._id,
        formData
      );

      toast.success(
        "Withdrawal marked paid"
      );

      setShowProofModal(false);
      setProofFile(null);
      setTransactionId("");

      fetchData();
    } catch (error) {
      toast.error(
        "Failed to update"
      );
    }
  };

  const filteredData =
    withdrawals.filter(
      (item: any) => {
        const matchesSearch =
          item.user?.name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchesStatus =
          statusFilter === "all"
            ? true
            : item.status ===
              statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );

  const pending =
    withdrawals.filter(
      (w) =>
        w.status ===
        "pending"
    ).length;

  const approved =
    withdrawals.filter(
      (w) =>
        w.status ===
        "approved"
    ).length;

  const paid =
    withdrawals.filter(
      (w) =>
        w.status === "paid"
    ).length;

  const rejected =
    withdrawals.filter(
      (w) =>
        w.status ===
        "rejected"
    ).length;

  if (loading) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        Withdrawal Management
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-yellow-100 rounded-xl p-4">
          <p>Pending</p>
          <h2 className="text-2xl font-bold">
            {pending}
          </h2>
        </div>

        <div className="bg-blue-100 rounded-xl p-4">
          <p>Approved</p>
          <h2 className="text-2xl font-bold">
            {approved}
          </h2>
        </div>

        <div className="bg-green-100 rounded-xl p-4">
          <p>Paid</p>
          <h2 className="text-2xl font-bold">
            {paid}
          </h2>
        </div>

        <div className="bg-red-100 rounded-xl p-4">
          <p>Rejected</p>
          <h2 className="text-2xl font-bold">
            {rejected}
          </h2>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row gap-4">

        <input
          type="text"
          placeholder="Search User..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="border rounded-lg p-2 flex-1"
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
          className="border rounded-lg p-2"
        >
          <option value="all">
            All Status
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="approved">
            Approved
          </option>

          <option value="paid">
            Paid
          </option>

          <option value="rejected">
            Rejected
          </option>
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3">
                User
              </th>
              <th className="p-3">
                Amount
              </th>
              <th className="p-3">
                Method
              </th>
              <th className="p-3">
                Details
              </th>
              <th className="p-3">
                Proof
                </th>
              <th className="p-3">
                Status
              </th>
              <th className="p-3">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map(
              (item: any) => (
                <tr
                  key={
                    item._id
                  }
                  className="border-t"
                >
                  <td className="p-3">
                    {
                      item.user
                        ?.name
                    }
                  </td>

                  <td className="p-3 font-semibold">
                    ₹
                    {
                      item.amount
                    }
                  </td>

                  <td className="p-3 uppercase">
                    {
                      item.paymentMethod
                    }
                  </td>

                  <td className="p-3 text-sm">
                    {item.paymentMethod ===
                    "upi" ? (
                      item.user
                        ?.upiId
                    ) : (
                      <div>
                        <p>
                          {
                            item
                              .user
                              ?.accountHolderName
                          }
                        </p>
                        <p>
                          {
                            item
                              .user
                              ?.bankName
                          }
                        </p>
                        <p>
                          {
                            item
                              .user
                              ?.accountNumber
                          }
                        </p>
                        <p>
                          {
                            item
                              .user
                              ?.ifscCode
                          }
                        </p>
                      </div>
                    )}
                  </td>

                  <td className="p-3">

                    {item.proofImage ? (
                        <a
                        href={item.proofImage}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                        >
                        View Proof
                        </a>
                    ) : (
                        "-"
                    )}

                    </td>

                  <td className="p-3">
                    {
                      item.status
                    }
                  </td>

                  <td className="p-3">
                    <div className="flex gap-2 flex-wrap">

                      {item.status ===
                        "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleApprove(
                                item._id
                              )
                            }
                            className="bg-blue-600 text-white px-3 py-1 rounded"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() =>
                              handleReject(
                                item._id
                              )
                            }
                            className="bg-red-600 text-white px-3 py-1 rounded"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {item.status ===
                        "approved" && (
                        <button
                         onClick={() => {
                            setSelectedWithdrawal(item);
                            setShowProofModal(true);
                            }}
                          className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredData.map(
          (item: any) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow p-4"
            >
              <h3 className="font-bold">
                {
                  item.user
                    ?.name
                }
              </h3>

              <p>
                Amount: ₹
                {
                  item.amount
                }
              </p>

              <p>
                Method:{" "}
                {
                  item.paymentMethod
                }
              </p>

              <p>
                Status:{" "}
                {
                  item.status
                }
              </p>

              <div className="flex gap-2 mt-3">

                {item.status ===
                  "pending" && (
                  <>
                    <button
                      onClick={() =>
                        handleApprove(
                          item._id
                        )
                      }
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        handleReject(
                          item._id
                        )
                      }
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Reject
                    </button>
                  </>
                )}

                {item.status ===
                  "approved" && (
                  <button
                   onClick={() => {
                    setSelectedWithdrawal(item);
                    setShowProofModal(true);
                    }}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Paid
                  </button>
                )}
              </div>
            </div>
          )
        )}
      </div>
     
     {showProofModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="bg-white rounded-2xl p-6 w-full max-w-md">

      <h2 className="text-xl font-bold mb-4">
        Upload Payment Proof
      </h2>

      <input
        type="text"
        placeholder="Transaction ID / UTR Number"
        value={transactionId}
        onChange={(e) =>
          setTransactionId(
            e.target.value
          )
        }
        className="w-full border rounded-lg p-3 mb-4"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setProofFile(
            e.target.files?.[0] ||
              null
          )
        }
        className="w-full border rounded-lg p-3"
      />

      {proofFile && (
        <p className="mt-2 text-sm text-green-600">
          {proofFile.name}
        </p>
      )}

      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={() =>
            setShowProofModal(
              false
            )
          }
          className="px-4 py-2 border rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={
            handlePaidSubmit
          }
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Mark Paid
        </button>

      </div>
    </div>
  </div>
)}
    </div>
  );
}