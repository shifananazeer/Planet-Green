import User from "../models/User";

export const buildTree = async (
  userId: string
): Promise<any> => {
  const user = await User.findById(
    userId
  )
    .populate(
      "directReferrals",
      "name email mobile profileImage referralCode"
    )
    .lean();

  if (!user) return null;

  const children = await Promise.all(
    (user.directReferrals || []).map(
      async (child: any) =>
        await buildTree(
          child._id.toString()
        )
    )
  );

  return {
    _id: user._id,
    name: user.name,
    referralCode:
      user.referralCode,
    profileImage:
      user.profileImage,
    children,
  };
};




export const buildFullTree = async (
  userId: string
): Promise<any> => {
  const user = await User.findById(userId)
    .populate(
      "directReferrals",
      "name email mobile referralCode profileImage"
    )
    .lean();

  if (!user) return null;

  const children = await Promise.all(
    (user.directReferrals || []).map(
      async (child: any) =>
        await buildTree(
          child._id.toString()
        )
    )
  );

  return {
    _id: user._id,
    name: user.name,
    referralCode:
      user.referralCode,
    profileImage:
      user.profileImage,
    children,
  };
};