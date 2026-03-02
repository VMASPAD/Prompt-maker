import { Heading1, Heading2, Heading3, ParkingSquare, Quote, Image, List, Code, CodeSquare, Ruler } from "lucide-react"
import { ComponentType } from "react";
interface MenuProps {
  index?: number;
  icon: ComponentType<Record<string, unknown>>;
  title: string;
  description: string;
  img?: string;
  content: string;
}
export const navItems: MenuProps[] = [
  {
    icon: Heading1,
    title: "Heading 1",
    description: "Create main objetive",
    img: "https://placehold.co/200x50",
    content: "# Title",
  },
  {
    icon: Heading2,
    title: "Heading 2",
    description: "Create main objetive",
    img: "https://placehold.co/200x50",
    content: "## Title",
  },
  {
    icon: Heading3,
    title: "Heading 3",
    description: "Create main objetive",
    img: "https://placehold.co/200x50",
    content: "### Title",
  },
  {
    icon: ParkingSquare,
    title: "Paragraph",
    description: "Create main objetive",
    img: "https://placehold.co/200x50",
    content: "Paragraph content",
  },
  {
    icon: Quote,
    title: "Blockquote",
    description: "Create main objetive",
    img: "https://placehold.co/200x50",
    content: "> Blockquote   content",
  },
  {
    icon: Image,
    title: "Image",
    description: "Create main objetive",
    img: "https://placehold.co/200x50",
    content: "![](https://placehold.co/200x50)",
  },
  {
    icon: List,
    title: "List",
    description: "Create main objetive",
    img: "https://placehold.co/200x50",
    content: "- List item 1\n- List item 2\n- List item 3",
  },
  {
    icon: Code,
    title: "Code",
    description: "Create main objetive",
    img: "https://placehold.co/200x50",
    content: "`console.log('Hello, world!');`",
  },
  {
    icon: CodeSquare,
    title: "Code Block",
    description: "Create main objetive",
    img: "https://placehold.co/200x50",
    content: "```javascript\nconsole.log('Hello, world!');\n```",
  },
  {
    icon: Ruler,
    title: "Horizontal Rule",
    description: "Create main objetive",
    img: "https://placehold.co/200x50",
    content: "---",
  },
];

export const getIcon = (iconName?: string) => {
  switch (iconName) {
    case "Heading 1": return Heading1;
    case "Heading 2": return Heading2;
    case "Heading 3": return Heading3;
    case "Paragraph": return ParkingSquare;
    case "Blockquote": return Quote;
    case "Image": return Image;
    case "List": return List;
    case "Code": return Code;
    case "Code Block": return CodeSquare;
    case "Horizontal Rule": return Ruler;
    default: return Heading1;
  }
};
