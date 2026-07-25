import { useEffect, useState } from "react";
import {
  
  getCommissionLevels,
  createCommissionLevel,
  updateCommissionLevel,
  deleteCommissionLevel,
} from "../../services/commissionService";

import type { CommissionLevel } from "../../services/commissionService";

export default function CommissionSettings() {
  const [levels, setLevels] = useState<
    CommissionLevel[]
  >([]);

  const [newLevel, setNewLevel] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchLevels = async () => {
    try {
      const data = await getCommissionLevels();
      setLevels(data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  const handleAddLevel = async () => {
    if (!newLevel || !newAmount) return;

    try {
      setLoading(true);

      await createCommissionLevel({
        level: Number(newLevel),
        amount: Number(newAmount),
      });

      setNewLevel("");
      setNewAmount("");

      fetchLevels();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (
    item: CommissionLevel
  ) => {
    try {
      await updateCommissionLevel(item._id, {
        amount: item.amount,
        isActive: item.isActive,
      });

      alert("Updated Successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Delete this level?"
    );

    if (!confirmDelete) return;

    try {
      await deleteCommissionLevel(id);
      fetchLevels();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAmountChange = (
    id: string,
    value: number
  ) => {
    setLevels((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, amount: value }
          : item
      )
    );
  };

  const handleStatusChange = (
    id: string,
    checked: boolean
  ) => {
    setLevels((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, isActive: checked }
          : item
      )
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">
        Commission Settings
      </h2>

      {/* Add New Level */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <input
          type="number"
          placeholder="Level"
          value={newLevel}
          onChange={(e) =>
            setNewLevel(e.target.value)
          }
          className="border rounded-lg px-3 py-2"
        />

        <input
          type="number"
          placeholder="Commission Amount"
          value={newAmount}
          onChange={(e) =>
            setNewAmount(e.target.value)
          }
          className="border rounded-lg px-3 py-2"
        />

        <button
          onClick={handleAddLevel}
          disabled={loading}
          className="bg-green-600 text-white rounded-lg px-4 py-2"
        >
          Add Level
        </button>
      </div>

      {/* Levels */}

      <div className="space-y-3">
        {levels.map((item) => (
          <div
            key={item._id}
            className="border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="font-semibold">
              Level {item.level}
            </div>

            <input
              type="number"
              value={item.amount}
              onChange={(e) =>
                handleAmountChange(
                  item._id,
                  Number(e.target.value)
                )
              }
              className="border rounded-lg px-3 py-2 w-40"
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.isActive}
                onChange={(e) =>
                  handleStatusChange(
                    item._id,
                    e.target.checked
                  )
                }
              />
              Active
            </label>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  handleUpdate(item)
                }
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Update
              </button>

              <button
                onClick={() =>
                  handleDelete(item._id)
                }
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}