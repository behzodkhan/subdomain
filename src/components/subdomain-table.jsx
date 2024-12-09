import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

function SubdomainTable({ subdomains }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubdomains = subdomains
    .filter((subdomain) =>
      subdomain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subdomain.purpose.toLowerCase().includes(searchTerm.toLowerCase())
    )

  return (
    <div className="space-y-6 py-4">
      <div className="max-w-md mx-auto">
        <div className="relative bg-white rounded-md shadow-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search subdomains..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-300"
          />
        </div>
      </div>
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="overflow-auto max-h-[500px]">
          {filteredSubdomains.length > 0 ? (
            <Table>
              <TableHeader className="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 border-b border-gray-200">
                <TableRow>
                  <TableHead className="w-[200px] py-3 px-4 font-bold text-gray-800 uppercase text-sm tracking-wider">
                    Subdomain
                  </TableHead>
                  <TableHead className="py-3 px-4 font-bold text-gray-800 uppercase text-sm tracking-wider">
                    Purpose
                  </TableHead>
                  <TableHead className="py-3 px-4 font-bold text-gray-800 uppercase text-sm tracking-wider text-right">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubdomains.map((subdomain) => (
                  <TableRow
                    key={subdomain.name}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <TableCell className="py-3 px-4 font-medium text-gray-900">
                      <span className='text-lime-500'>{subdomain.name}</span>.dovuchcha.uz
                    </TableCell>
                    <TableCell className="py-3 px-4 text-gray-700">
                      {subdomain.purpose}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-right">
                      <Badge
                        variant={
                          subdomain.status === 'active'
                            ? 'success'
                            : subdomain.status === 'inactive'
                            ? 'destructive'
                            : 'warning'
                        }
                      >
                        {subdomain.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center p-4">
              <svg
                className="w-12 h-12 text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15M4.5 12h15" />
              </svg>
              <p className="text-xl font-semibold text-gray-700 mb-2">
                No subdomains found
              </p>
              <p className="text-gray-500">
                This subdomain is free! Consider adding it to your collection.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SubdomainTable;