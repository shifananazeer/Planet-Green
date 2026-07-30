import { useEffect, useState } from "react";
import Tree from "react-d3-tree";
import { getFullNetworkTree , getNetworkStats } from "../../services/referralService";
import CommissionPlans from "../../components/admin/CommissionPlans";
interface TreeNode {
  _id: string;
  name: string;
  referralCode?: string;
  children?: TreeNode[];
}

export default function AdminNetworkTreePage() {
  const [treeData, setTreeData] =
    useState<any>(null);

  const [isMobile, setIsMobile] =
    useState(false);

    const [stats, setStats] =
  useState<any>(null);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(
        window.innerWidth < 768
      );
    };

    checkScreen();

    window.addEventListener(
      "resize",
      checkScreen
    );

    return () =>
      window.removeEventListener(
        "resize",
        checkScreen
      );
  }, []);

  const convertToD3Tree = (
    node: TreeNode
  ): any => ({
    name: node.name,
    attributes: {
      code: node.referralCode,
    },
    children:
      node.children?.map(
        convertToD3Tree
      ) || [],
  });

  const fetchStats = async () => {
  try {
    const res =
      await getNetworkStats();

    if (res.success) {
      setStats(res.data);
    }
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  fetchStats();
}, []);

  const fetchTree = async () => {
    try {
      const res =
        await getFullNetworkTree();

      if (res.success) {
        setTreeData(
          convertToD3Tree(
            res.data
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTree();
  }, []);

  const renderNode = ({
    nodeDatum,
  }: any) => {
    const isRoot =
      nodeDatum.name ===
      treeData?.name;

    return (
      <g>
        <foreignObject
          width={
            isMobile ? 130 : 190
          }
          height={
            isMobile ? 80 : 100
          }
          x={
            isMobile ? -65 : -95
          }
          y={
            isMobile ? -40 : -50
          }
        >
          <div
            className={`h-full rounded-xl shadow-lg border-2 flex flex-col items-center justify-center px-2
            ${
              isRoot
                ? "bg-blue-50 border-blue-600"
                : "bg-white border-green-500"
            }`}
          >
            <div
              className={`font-bold text-center ${
                isMobile
                  ? "text-xs"
                  : "text-sm"
              }`}
            >
              {nodeDatum.name}
            </div>

            <div className="text-[10px] text-gray-500 mt-1">
              {
                nodeDatum.attributes
                  ?.code
              }
            </div>

            {!isMobile && (
              <div
                className={`mt-2 text-xs font-semibold ${
                  isRoot
                    ? "text-blue-600"
                    : "text-green-600"
                }`}
              >
                {isRoot
                  ? "Root Admin"
                  : "Member"}
              </div>
            )}
          </div>
        </foreignObject>
      </g>
    );
  };

  if (!treeData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        Loading network...
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-3 md:p-6">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-4 md:p-5 border-b">
          <h1 className="text-xl md:text-2xl font-bold">
            Complete Network Tree
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            View the entire MLM
            organization structure
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
  <div className="bg-blue-50 rounded-xl p-4">
    <p className="text-sm text-gray-500">
      Total Users
    </p>

    <h2 className="text-2xl font-bold text-blue-600">
      {stats?.totalUsers || 0}
    </h2>
  </div>

  <div className="bg-green-50 rounded-xl p-4">
    <p className="text-sm text-gray-500">
      Active Users
    </p>

    <h2 className="text-2xl font-bold text-green-600">
      {stats?.activeUsers || 0}
    </h2>
  </div>

  <div className="bg-purple-50 rounded-xl p-4">
    <p className="text-sm text-gray-500">
      Total Orders
    </p>

    <h2 className="text-2xl font-bold text-purple-600">
      {stats?.totalOrders || 0}
    </h2>
  </div>

  <div className="bg-yellow-50 rounded-xl p-4">
    <p className="text-sm text-gray-500">
      Total Sales
    </p>

    <h2 className="text-2xl font-bold text-yellow-600">
      ₹
      {stats?.totalSales?.toLocaleString() ||
        0}
    </h2>
  </div>
</div>
   <CommissionPlans />

<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
  <div className="bg-cyan-50 rounded-xl p-4">
    <p className="text-sm text-gray-500">
      Direct Referrals
    </p>

    <h2 className="text-2xl font-bold text-cyan-600">
      {stats?.directReferrals || 0}
    </h2>
  </div>

  <div className="bg-indigo-50 rounded-xl p-4">
    <p className="text-sm text-gray-500">
      Max Depth
    </p>

    <h2 className="text-2xl font-bold text-indigo-600">
      {stats?.maximumDepth || 0}
    </h2>
  </div>

  <div className="bg-pink-50 rounded-xl p-4">
    <p className="text-sm text-gray-500">
      Commissions Paid
    </p>

    <h2 className="text-2xl font-bold text-pink-600">
      ₹
      {stats?.totalCommissionsPaid?.toLocaleString() ||
        0}
    </h2>
  </div>

  <div className="bg-orange-50 rounded-xl p-4">
    <p className="text-sm text-gray-500">
      Wallet Distributed
    </p>

    <h2 className="text-2xl font-bold text-orange-600">
      ₹
      {stats?.walletDistributed?.toLocaleString() ||
        0}
    </h2>
  </div>
</div>

        <div className="w-full h-[75vh] overflow-auto">
          <Tree
            data={treeData}
            orientation="vertical"
            translate={{
              x: isMobile
                ? 180
                : 600,
              y: 100,
            }}
            nodeSize={{
              x: isMobile
                ? 180
                : 260,
              y: isMobile
                ? 130
                : 170,
            }}
            separation={{
              siblings: 1.5,
              nonSiblings: 2,
            }}
            pathFunc="step"
            collapsible
            zoomable
            renderCustomNodeElement={
              renderNode
            }
          />
        </div>
      </div>
    </div>
  );
}