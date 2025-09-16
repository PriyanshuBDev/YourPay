export default function categoryColorSetter(category?: string) {
  let color: string;
  let color2: string;
  let colorText: string;
  let colorBorder: string;

  if (category === "Subscriptions") {
    color = "bg-indigo-500";
    color2 = "bg-indigo-50";
    colorText = "text-indigo-700";
    colorBorder = "border-indigo-500";
  } else if (category === "Food & Dining") {
    color = "bg-orange-500";
    color2 = "bg-orange-50";
    colorText = "text-orange-700";
    colorBorder = "border-orange-500";
  } else if (category === "Shopping") {
    color = "bg-pink-500";
    color2 = "bg-pink-50";
    colorText = "text-pink-700";
    colorBorder = "border-pink-500";
  } else if (category === "Installments") {
    color = "bg-rose-500";
    color2 = "bg-rose-50";
    colorText = "text-rose-700";
    colorBorder = "border-rose-500";
  } else if (category === "Travel") {
    color = "bg-teal-500";
    color2 = "bg-teal-50";
    colorText = "text-teal-700";
    colorBorder = "border-teal-500";
  } else if (category === "Miscellaneous") {
    color = "bg-yellow-500";
    color2 = "bg-yellow-50";
    colorText = "text-yellow-700";
    colorBorder = "border-yellow-500";
  } else if (category === "Bills & Utilities") {
    color = "bg-emerald-500";
    color2 = "bg-emerald-50";
    colorText = "text-emerald-700";
    colorBorder = "border-emerald-500";
  } else if (category === "Savings") {
    color = "bg-green-500";
    color2 = "bg-green-50";
    colorText = "text-green-700";
    colorBorder = "border-green-500";
  } else if (category === "Health") {
    color = "bg-blue-500";
    color2 = "bg-blue-50";
    colorText = "text-blue-700";
    colorBorder = "border-blue-500";
  } else if (category === "Entertainment") {
    color = "bg-violet-500";
    color2 = "bg-violet-50";
    colorText = "text-violet-700";
    colorBorder = "border-violet-500";
  } else {
    color = "bg-red-500";
    color2 = "bg-red-50";
    colorText = "text-red-700";
    colorBorder = "border-red-500";
  }
  return { color, color2, colorText, colorBorder };
}
