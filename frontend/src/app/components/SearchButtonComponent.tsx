import React, { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export const SearchButtonComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const [isTypeSubmit, setTypeSubmit] = useState<'button' | 'submit'>('button');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if(searchTerm !== '') {
        router.push(`/store/?search=${searchTerm}`)
  };
}

  return (
    <form className="relative flex items-center ml-auto" onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={`transition-width duration-300 ease-in-out border border-gray-300 rounded-full pl-7 pr-2 py-2 ${isOpen ? 'w-36 opacity-100' : 'w-0 opacity-0'}`}
        placeholder="Search..."
      />
      <button
        onClick={() => {
            if(!isOpen) {
                setIsOpen(!isOpen)
            } 
            if(isOpen && searchTerm === '') {
                setTypeSubmit('button')
                setIsOpen(false)
            }
            if(isOpen && searchTerm !== '') {
                setIsOpen(true)
                setTypeSubmit('submit')
            }
        }}
        type={isTypeSubmit}
        className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-10 duration-300`}
      >
        <Image
          width={28}
          height={28}
          alt="search icon"
          src={'./search.svg'}
          className="transition-transform duration-300 ease-in-out"
        />
      </button>
    </form>
  );
}