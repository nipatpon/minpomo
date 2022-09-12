import {
	FcInfo,
	FcIdea,
	FcLikePlaceholder,
	FcHeadset,
	FcCollaboration,
} from "react-icons/fc";

type TCategoryIcon = {
	key: "generals" | "think" | "health" | "music" | "comunicate";
	icon: Function;
};
export const CategoryIconSet: TCategoryIcon[] = [
	{
		key: "generals",
		icon: FcInfo,
	},
	{
		key: "think",
		icon: FcIdea,
	},
	{
		key: "health",
		icon: FcLikePlaceholder,
	},
	{
		key: "music",
		icon: FcHeadset,
	},
	{
		key: "comunicate",
		icon: FcCollaboration,
	},
];
