import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from "@/styles/Home.module.css";
import { Button, Spinner, Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr, Flex } from '@chakra-ui/react';
import { Container, TitlePage, Title, ButtonWrapper } from '../../styles/pages/teacher/style';
import TeacherModal from '@/components/Modals/ModalTeacher'; 
import ModalCreateTeacher from '@/components/Modals/ModalCreateTeacher';

interface Teacher {
    id: number;
    name: string;
    employee_id: string;
    email: string;
}

export default function TeacherManagement() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchTeachers = async () => {
            const token = localStorage.getItem('token'); // Recuperar o token do localStorage
            if (token) {
                setLoading(true);
                try {
                    const response = await axios.get('https://marcacao-sala.vercel.app/teacher', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setTeachers(response.data);
                } catch (error) {
                    console.error('Erro ao buscar professores:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                // Redirecionar para a página de login se não houver token
                router.push('/login');
            }
        };
        fetchTeachers();
    }, [router]);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleTeacherClick = (teacherId: number) => {
        setSelectedTeacherId(teacherId);
        handleOpenModal();
    };

    const handleOpenCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    return (
        <>
            <Head>
                <title>Professores</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main className={`${styles.main}`}>
                <Container>
                    <TitlePage>
                        <Title>
                            Gerenciamento de Professores
                        </Title>
                        <ButtonWrapper>
                            <Button bg="#006a12" _hover={{ bg: 'green.500' }} color="white" onClick={handleOpenCreateModal}>+ <span>Adicionar Professor</span></Button>
                        </ButtonWrapper>
                    </TitlePage>

                    <TableContainer>
                        {loading ? (
                            <Flex justify="center" align="center" height="600px">
                                <Spinner
                                    thickness='10px'
                                    speed='0.65s'
                                    emptyColor='gray.200'
                                    width={150}
                                    height={150}
                                    color='green.500' />
                            </Flex>
                        ) : (
                            <Table variant='simple' colorScheme='green'>
                                <Thead>
                                    <Tr>
                                        <Th>Nome</Th>
                                        <Th>E-mail</Th>
                                        <Th>ID do Funcionário</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {teachers.map(teacher => (
                                        <Tr key={teacher.id} onClick={() => handleTeacherClick(teacher.id)}  style={{ cursor: 'pointer' }}
                                        _hover={{ bg: 'green.100', boxShadow: 'md' }}>
                                            <Td>{teacher.name}</Td>
                                            <Td>{teacher.email}</Td>
                                            <Td>{teacher.employee_id}</Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        )}
                    </TableContainer>

                    <TeacherModal
                        isOpen={isModalOpen}
                        teacherId={selectedTeacherId}
                        onClose={handleCloseModal}
                    />

                    <ModalCreateTeacher
                        isOpen={isCreateModalOpen}
                        onClose={handleCloseCreateModal}
                    />
                </Container>
            </main>
        </>
    );
}