"use client"

import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { RoleType } from '@/types/RoleType';

export default function RoleTreeView({ onSelectRole }: { onSelectRole: (role: RoleType) => void }): React.JSX.Element {

  const [treeData, setTreeData] = useState<RoleType[]>([]);

  useEffect(() => {
    fetch("api/v1/roles")
      .then(res => res.status === 200 && res.json())
      .then(data => setTreeData(data));
  }, [])

  return (
    <Box sx={{ minHeight: 352, minWidth: 250, mx: 2, mb: 2, py: 2, border: 1, borderRadius: 2 }}>
      <SimpleTreeView aria-label="icon expansion" expansionTrigger="iconContainer" slots={{ expandIcon: ChevronLeftIcon }}>
        {
          treeData.map(role => (
            <TreeItem itemId={role.title} key={role._id} label={role.title} onClick={() => onSelectRole(role)} />
          ))
        }

      </SimpleTreeView>
    </Box>
  )
}