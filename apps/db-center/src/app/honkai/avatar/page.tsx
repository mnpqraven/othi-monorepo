import { server } from "@/app/_trpc/serverClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function Page() {
  const list = await server.honkai.avatar.list();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Rarity</TableHead>
          <TableHead>Tag</TableHead>
          <TableHead>Element</TableHead>
          <TableHead>Path</TableHead>
          <TableHead>Energy</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {list.map((avatar) => (
          <TableRow key={avatar.id}>
            <TableCell>{avatar.id}</TableCell>
            <TableCell>{avatar.name}</TableCell>
            <TableCell>{avatar.rarity}</TableCell>
            <TableCell>{avatar.votag}</TableCell>
            <TableCell>{avatar.damageType}</TableCell>
            <TableCell>{avatar.path}</TableCell>
            <TableCell>{avatar.spneed}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
