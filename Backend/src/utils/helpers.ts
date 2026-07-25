import User from "../models/User";


export const getMaxDepth = async (
  userId: string,
  depth = 1
): Promise<number> => {
  const user = await User.findById(
    userId
  ).select("directReferrals");

  if (
    !user ||
    !user.directReferrals?.length
  ) {
    return depth;
  }

  const depths = await Promise.all(
    user.directReferrals.map(
      async (child: any) =>
        await getMaxDepth(
          child.toString(),
          depth + 1
        )
    )
  );

  return Math.max(...depths);
};