import { useEffect, useState } from "react";
import Tree from "react-d3-tree";
import { getReferralTree } from "../../services/referralService";

interface TreeNode {
  _id: string;
  name: string;
  referralCode?: string;
  children?: TreeNode[];
}

export default function NetworkTreePage() {
  const [treeData, setTreeData] =
    useState<any>(null);

  const [isMobile, setIsMobile] =
    useState(false);

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

  const fetchTree = async () => {
    try {
      const res =
        await getReferralTree();

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
                ? "bg-blue-50 border-blue-500"
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
                  ? "You"
                  : "Team Member"}
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
        <div className="text-lg font-medium">
          Loading network...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-3 md:p-6">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-5 border-b">
          <h1 className="text-xl md:text-2xl font-bold">
            My Network Tree
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            View your referral
            network structure
          </p>
        </div>

        {/* Tree */}
        <div className="w-full h-[75vh] overflow-auto">
          <Tree
            data={treeData}
            orientation="vertical"
            translate={{
              x: isMobile
                ? 180
                : 500,
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