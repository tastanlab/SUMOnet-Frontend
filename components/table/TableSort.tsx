'use client';
import React, { useState, useEffect } from 'react';
import { Table, ScrollArea, UnstyledButton, Text, Center, TextInput, rem, Pagination, Space, Button, Flex, ActionIcon } from '@mantine/core';
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch, IconDownload, IconX } from '@tabler/icons-react';
import classes from './TableSort.module.css';

interface RowData {
  protein_id: string;
  protein_name: string;  // Add this line
  peptide_seq: string;
  lysine_position: number;
  nonsumoylation_class_probs: number;
  sumoylation_class_probs: number;
  predicted_labels: number;
}

interface TableResProps {
  predictions: RowData[];
}

// Function to generate CSV content from table data
function generateCSV(predictions) {
  let csvContent = 'protein_id, protein_name, peptide_seq, lysine_position, nonsumoylation_class_probs, sumoylation_class_probs, predicted_labels\n';
  predictions.forEach(prediction => {
    csvContent += `${prediction.protein_id}, ${prediction.protein_id}, ${prediction.peptide_seq}, ${prediction.lysine_position}, ${prediction.nonsumoylation_class_probs}, ${prediction.sumoylation_class_probs}, ${prediction.predicted_labels}\n`;
  });
  return csvContent;
}

function filterData(data: RowData[], searchProteinId: string, searchLysinePosition: string) {
  const queryProteinId = searchProteinId.toLowerCase().trim();
  const queryLysinePosition = searchLysinePosition.toLowerCase().trim();
  if (!data || data.length === 0) return [];
  return data.filter((item) =>
    (item.protein_id.toLowerCase().includes(queryProteinId)) &&
    (item.lysine_position.toString().includes(queryLysinePosition))
  );
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
  showSearch?: boolean;
  onToggleSearch?: () => void;
  searchValue?: string;
  onSearchChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

function Th({ children, reversed, sorted, onSort, showSearch, onToggleSearch, searchValue, onSearchChange, placeholder }: ThProps) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th className={classes.th}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <UnstyledButton onClick={onSort} style={{ display: 'flex', alignItems: 'center' }}>
          <Text fw={500} fz="md">
            {children}
          </Text>
          <Space w="xs" />
          <Center className={classes.icon}>
            <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
        </UnstyledButton>
        {onToggleSearch && (
          <ActionIcon onClick={onToggleSearch} variant="transparent" style={{ color: 'inherit' }}>
            <IconSearch size={16} />
          </ActionIcon>
        )}
      </div>
      {showSearch && (
        <TextInput
          value={searchValue}
          onChange={onSearchChange}
          placeholder={placeholder}
          style={{ marginTop: '5px', width: '120px', fontWeight: 'normal' }}  // Adjust width and font weight here
          rightSection={
            <ActionIcon onClick={onToggleSearch} variant="transparent" style={{ color: 'inherit' }}>
              <IconX size={16} />
            </ActionIcon>
          }
        />
      )}
    </Table.Th>
  );
}

function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; searchProteinId: string; searchLysinePosition: string }
) {
  const { sortBy, reversed, searchProteinId, searchLysinePosition } = payload;
  let filteredData = filterData(data, searchProteinId, searchLysinePosition);
  if (!sortBy || !Array.isArray(filteredData)) {
    return filteredData;
  }
  filteredData.sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return reversed ? bValue - aValue : aValue - bValue;
    }
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return reversed
        ? bValue.localeCompare(aValue)
        : aValue.localeCompare(bValue);
    }
    return 0;
  });
  return filteredData;
}

export function TableSort({ predictions }: TableResProps) {
  const [searchProteinId, setSearchProteinId] = useState('');
  const [searchLysinePosition, setSearchLysinePosition] = useState('');
  const [searchProteinName, setSearchProteinName] = useState('');
  const [sortedData, setSortedData] = useState(predictions);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [showProteinIdSearch, setShowProteinIdSearch] = useState(false);
  const [showProteinNameSearch, setShowProteinNameSearch] = useState(false);
  const [showLysinePositionSearch, setShowLysinePositionSearch] = useState(false);

  useEffect(() => {
    setSortedData(sortData(predictions, { sortBy, reversed: reverseSortDirection, searchProteinId, searchLysinePosition }));
  }, [predictions, sortBy, reverseSortDirection, searchProteinId, searchLysinePosition]);

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(predictions, { sortBy: field, reversed, searchProteinId, searchLysinePosition }));
  };

  const handleDownloadCSV = () => {
    const csvContent = generateCSV(predictions);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'predictions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleToggleProteinIdSearch = () => {
    setShowProteinIdSearch(!showProteinIdSearch);
    if (showProteinIdSearch) {
      setSearchProteinId('');
      setSortedData(sortData(predictions, { sortBy, reversed: reverseSortDirection, searchProteinId: '', searchLysinePosition }));
    }
  };

  const handleToggleProteinNameSearch = () => {
    setShowProteinNameSearch(!showProteinNameSearch);
    if (showProteinNameSearch) {
      setSearchProteinName('');
      setSortedData(sortData(predictions, { sortBy, reversed: reverseSortDirection, searchProteinId: '', searchLysinePosition }));
    }
  };

  const handleToggleLysinePositionSearch = () => {
    setShowLysinePositionSearch(!showLysinePositionSearch);
    if (showLysinePositionSearch) {
      setSearchLysinePosition('');
      setSortedData(sortData(predictions, { sortBy, reversed: reverseSortDirection, searchProteinId, searchLysinePosition: '' }));
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Apply search and sorting to the entire dataset
  const filteredAndSortedData = sortData(predictions, { sortBy, reversed: reverseSortDirection, searchProteinId, searchLysinePosition });

  // Apply pagination to the filtered and sorted data
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredAndSortedData.slice(indexOfFirstRow, indexOfLastRow);

  let i = 0;

  const rows = currentRows.map((row) => (
    <Table.Tr key={i++} className={classes.peptideSequence}>
      <Table.Td className={classes.td}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <a href={`https://www.uniprot.org/uniprotkb/${row.protein_id}`} style={{ color: "#3333A2" }}>{row.protein_id}</a>
          <Space w="xs" />
        </div>
      </Table.Td>
      <Table.Td className={classes.td}>{row.protein_name}</Table.Td>
      <Table.Td className={classes.td}>{row.lysine_position}</Table.Td>
      <Table.Td className={classes.td}>
        <span style={{ display: 'inline-block' }}>
          {row.peptide_seq.split('').map((char, index) => (
            <span key={index} style={{ fontWeight: index === 10 ? 'bold' : 'normal', color: index === 10 ? 'darkblue' : 'inherit', fontSize: index === 10 ? '1.2rem' : 'inherit' }}>
              {char}
            </span>
          ))}
        </span>
      </Table.Td>
      <Table.Td className={classes.td}>{row.sumoylation_class_probs.toFixed(3)}</Table.Td>
      <Table.Td className={classes.td}>{row.predicted_labels}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <ScrollArea>
        <Table striped highlightOnHover withTableBorder withColumnBorders horizontalSpacing="md" verticalSpacing="xs" width={700}>
          <thead>
            <tr>
              <Th
                sorted={sortBy === 'protein_id'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('protein_id')}
                showSearch={showProteinIdSearch}
                onToggleSearch={handleToggleProteinIdSearch}
                searchValue={searchProteinId}
                onSearchChange={(e) => {
                  setSearchProteinId(e.target.value);
                  setSortedData(sortData(predictions, { sortBy, reversed: reverseSortDirection, searchProteinId: e.target.value, searchLysinePosition }));
                }}
                placeholder="Search"
              >
                Protein ID
              </Th>
              <Th sorted={sortBy === 'protein_name'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('protein_name')}>
              Protein Name
              </Th>
              <Th
                sorted={sortBy === 'lysine_position'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('lysine_position')}
                showSearch={showLysinePositionSearch}
                onToggleSearch={handleToggleLysinePositionSearch}
                searchValue={searchLysinePosition}
                onSearchChange={(e) => {
                  setSearchLysinePosition(e.target.value);
                  setCurrentPage(1);
                  setSortedData(sortData(predictions, { sortBy, reversed: reverseSortDirection, searchProteinId, searchLysinePosition: e.target.value }));
                }}
                placeholder="Search"
              >
                Lysine Pos.
              </Th>
              <Th
                sorted={sortBy === 'peptide_seq'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('peptide_seq')}
              >
                Peptide Seq.
              </Th>
              <Th
                sorted={sortBy === 'sumoylation_class_probs'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('sumoylation_class_probs')}
              >
                Sumoylation Prob.
              </Th>
              <Th
                sorted={sortBy === 'predicted_labels'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('predicted_labels')}
              >
                Prediction
              </Th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? rows : (
              <tr>
                <td colSpan={6}>
                  <Text align="center" weight={500} m={20}>
                    Nothing found
                  </Text>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <Space h="lg" />
        <Flex direction={'row'} gap="280px" align="center" justify="center"   >
          {filteredAndSortedData.length > 0 && (
            <>
              <Flex direction={'row'} justify="space-between" align="center" style={{ width: '900px' }}>
                <Pagination
                  total={Math.ceil(filteredAndSortedData.length / rowsPerPage)}  // Use filteredAndSortedData for total pages
                  onChange={handlePageChange}
                  value={currentPage}
                />
                <Button
                  leftSection={<IconDownload style={{ width: rem(20), height: rem(20), color: "white" }} stroke={2} />}
                  onClick={handleDownloadCSV}
                  size="md"
                  w="195px"
                  radius="md"
                  variant="gradient"
                  color="blue"
                >
                  Download CSV
                </Button>
              </Flex>
            </>
          )}
        </Flex>
        <Space h="lg" />
      </ScrollArea>
    </>
  );
}

export default TableSort;
