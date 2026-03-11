import { Table, Paper } from "@mantine/core";
import "../../custom-scrollbar.css";

export default function DataEntryTable({
  columns = [],
  children,
  height = "calc(100vh - 410px)",
  showActions = true,
  headerBg = "white",
  headerShadow = "inset 0 -3px 0 #0077FF",
  minWidth = "100%",     // 👈 default responsive (NO PX)
}) {
  return (
    <Paper
      radius="md"
      withBorder
      w="100%"
      p="md"
      style={{
        height,
        display: "flex",
        flexDirection: "column",
        boxShadow: "0px 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="custom-scroll"
        style={{
          flex: 1,
          overflow: "auto",
        }}
      >
        <div style={{ minWidth }}>
          <Table layout="fixed" horizontalSpacing="md" verticalSpacing="md">
            <Table.Thead
              style={{
                position: "sticky",
                top: 0,
                background: headerBg,
                zIndex: 10,
                boxShadow: headerShadow,
              }}
            >
              <Table.Tr>
                {columns.map((c) => (
                  <Table.Th
                    key={c.key}
                    ta="center"
                    c="#265768"
                    fw={600}
                    fz="15px"
                  >
                    {c.label}
                  </Table.Th>
                ))}

                {showActions && (
                  <Table.Th ta="center" c="#265768" fw={600} fz="15px">
                    Actions
                  </Table.Th>
                )}
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>{children}</Table.Tbody>
          </Table>
        </div>
      </div>
    </Paper>
  );
}
