'use client';
import React, { useState } from 'react';
import { Table, ScrollArea, UnstyledButton, Group, Text, Center, TextInput, rem, Pagination, Space, Button, Flex } from '@mantine/core';
import { IconSelector, IconLink ,IconChevronDown, IconChevronUp, IconSearch, IconDownload } from '@tabler/icons-react';
import classes from './TableSort.module.css';

interface RowData {
  protein_id: string;
  peptide_seq: string;
  lysine_position: number;
  nonsumoylation_class_probs: number;
  sumoylation_class_probs: number;
  predicted_labels: number;
}

interface TableResProps {
  predictions: RowData[]; // Predictions prop
}

// Function to generate CSV content from table data
function generateCSV(predictions) {
  // Header row
  let csvContent = 'protein_id, peptide_seq, lysine_position, nonsumoylation_class_probs, sumoylation_class_probs, predicted_labels\n';
  
  // Data rows
  predictions.forEach(prediction => {
    csvContent += `${prediction.uniprot_id}, ${prediction.peptide_seq}, ${prediction.lysine_position}, ${prediction.nonsumoylation_class_probs}, ${prediction.sumoylation_class_probs}, ${prediction.predicted_labels}\n`;
  });

  return csvContent;
}


function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  if (!data || data.length === 0) return [];
  return data.filter((item) =>
    Object.keys(item).some(
      (key) => item[key as keyof RowData].toString().toLowerCase().includes(query)
    )
  );
}


interface ThProps {
    children: React.ReactNode;
    reversed: boolean;
    sorted: boolean;
    onSort(): void;
  }

  
  function Th({ children, reversed, sorted, onSort }: ThProps) {
    const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
    return (
      <Table.Th className={classes.th}>
        <UnstyledButton onClick={onSort} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Text fw={500} fz="md">
            {children}
          </Text>
          <Space w="xs" />
          <Center className={classes.icon}>
            <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
        </UnstyledButton>
      </Table.Th>
    );
  }
  

function sortData(
    data: RowData[],
    payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
  ) {
    // Destructure payload for ease of use
    const { sortBy, reversed, search } = payload;
  
    // First, filter the data according to the search term
    let filteredData = filterData(data, search);
  
    if (!sortBy || !Array.isArray(filteredData)){
      return filteredData;
    }
  
    // Sort the data according to the type of values in the sortBy column
    filteredData.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
  
      // If the values are numbers, we perform a numeric sort
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return reversed ? bValue - aValue : aValue - bValue;
      }
  
      // If the values are strings, we perform a locale-based sort
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return reversed
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue);
      }
  
      // If values are mixed or of different types, they remain unchanged in order
      return 0;
    });
  
    return filteredData;
  }


export function TableSort({ predictions }: TableResProps) {

  let predictionsDa
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(predictions); // Initialize sortedData with predictions
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [searchUsed, setSearchUsed] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10); // You can adjust the number of rows per page as needed

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(predictions, { sortBy: field, reversed, search })); // Sort predictions data
  };

  // Function to handle downloading the table data as CSV
  const handleDownloadCSV = () => {
    // Generate CSV content
    const csvContent = generateCSV(predictions);
    // Create a Blob containing the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv' });
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    // Create a temporary anchor element
    const a = document.createElement('a');
    // Set the URL as the anchor's href
    a.href = url;
    // Set the filename for the download
    a.download = 'predictions.csv';
    // Simulate a click on the anchor to trigger the download
    a.click();
    // Cleanup
    URL.revokeObjectURL(url);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    currentPage !== 1 && setCurrentPage(1); // Reset to first page when searching
    
    if (search === '' || search.length === 0 || search === null) {
      setSearchUsed(false);
    }
    setSearchUsed(true);
    
    const { value } = event.currentTarget;
    setSearch(value);

  
    // Update sortedData based on the search term
    const newData = sortData(predictions, { sortBy, reversed: reverseSortDirection, search: value });
    setSortedData(newData);
  };
  



  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  
  let sortedAndFilteredData = sortData(predictions, { sortBy, reversed: reverseSortDirection, search });

  // Get the current rows to display based on pagination
  const currentRows = sortedAndFilteredData.slice(indexOfFirstRow, indexOfLastRow);

  console.log("Index of first row: ", indexOfFirstRow);
  console.log("Index of last row: ", indexOfLastRow);

 
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  let i = 0;

  const rows = currentRows.map((row) => (
    <Table.Tr key={i++} className={ classes.peptideSequence}>
      <Table.Td className={classes.td}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <a href={`https://www.uniprot.org/uniprotkb/${row.protein_id}`} style={{color: "#3333A2"}}>{row.protein_id}</a>
          <Space w="xs" />
        </div>
      </Table.Td>
      <Table.Td className={`${classes.td}`}>
        {/* Apply custom styling for peptide sequence */}
        <span style={{ display: 'inline-block' }}>
          {row.peptide_seq.split('').map((char, index) => (
            <span key={index} style={{ fontWeight: index === 10 ? 'bold' : 'normal', color: index === 10 ? 'darkblue' : 'inherit', fontSize: index === 10 ? '1.2rem' : 'inherit'}}>
              {char}
            </span>
          ))}
        </span>
      </Table.Td>
      <Table.Td className={classes.td}>{row.lysine_position}</Table.Td>
      <Table.Td className={classes.td}>{row.sumoylation_class_probs.toFixed(3)}</Table.Td>
      <Table.Td className={classes.td}>{row.predicted_labels}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
    <ScrollArea>
      <TextInput
        placeholder="Search by any field"
        mb="md"
        leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table  striped
  highlightOnHover
  withTableBorder
  withColumnBorders
  horizontalSpacing="md"
  verticalSpacing="xs"
  width={700}
  
  
  >
      <thead>
          <tr>
            <Th 
              sorted={sortBy === 'protein_id'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('protein_id')}
            >
              Protein ID
            </Th>
            <Th

              sorted={sortBy === 'peptide_seq'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('peptide_seq')}
              
            >
              Peptide Sequence
            </Th>
            <Th
              sorted={sortBy === 'lysine_position'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('lysine_position')}
            >
              Lysine Position
            </Th>
            <Th
              sorted={sortBy === 'sumoylation_class_probs'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('sumoylation_class_probs')}
            >
              Sumoylation Prob
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
            <tr >
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
      <Flex direction={'row'} gap="275px" align="center" justify="center">
      {predictions && predictions.length > 0 && (
        <>
          <Pagination
            total={Math.ceil(predictions.length / rowsPerPage)} // Total number of pages
            onChange={handlePageChange}
            
            //disabled={search === '' ? false : true}
            value={currentPage}
            
          />
          <Button
            leftSection={<IconDownload style={{ width: rem(16), height: rem(16), color: "white" }} stroke={1} />}
            onClick={handleDownloadCSV}
            size="md"
            w="195px"
            radius="md"
            variant="gradient"
            color="blue"
          >
            Download
          </Button>
        </>
)}
      </Flex>
      <Space h="lg" />
    </ScrollArea>
    </>
  );
}

export default TableSort;
