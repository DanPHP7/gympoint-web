import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

import api from '~/services/api';
import history from '~/services/history';
import HeaderDefault from '~/components/HeaderDefault';
import Title from '~/components/Title';
import { Container, SearchInput } from './styles';
import DefaultButton from '~/components/DefaultButton';
import ConfirmDelete from '~/components/ConfirmDelete';
import List from '~/pages/_layouts/List';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [t] = useTranslation();

  async function loadAllStudents() {
    try {
      const response = await api.get('/students', {
        params: {
          q: search,
          page,
        },
      });
      setStudents(response.data);
    } catch (error) {
      toast.error('Something went wrong');
    }
  }

  const loadStudents = useCallback(async () => {
    await loadAllStudents();
  }, [search, page]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);
  async function handleClickDelete(id, index) {
    try {
      await api.delete(`/students/${id}`);

      const arrayOfStudents = students;

      arrayOfStudents.splice(index, 1);

      setStudents(arrayOfStudents);

      history.push('/students');
    } catch (error) {
      toast.error('Erro ao Deletar Usuário!');
    }
  }

  function handleDelete(id, index) {
    confirmAlert({
      // eslint-disable-next-line react/prop-types
      customUI: ({ onClose }) => {
        return (
          <ConfirmDelete>
            <h1>{t('alunos.table.alert.delete.message')}</h1>

            <div>
              <button className="noDelete" type="button" onClick={onClose}>
                {t('alunos.table.alert.delete.1')}
              </button>
              <button
                className="delete"
                type="button"
                onClick={() => {
                  handleClickDelete(id, index);
                  onClose();
                }}
              >
                {t('alunos.table.alert.delete.2')}
              </button>
            </div>
          </ConfirmDelete>
        );
      },
    });
  }

  function handlePage(action) {
    setPage(action === 'back' ? page - 1 : page + 1);

    loadStudents();
  }

  return (
    <Container>
      <HeaderDefault>
        <>
          <Title>{t('alunos.titulo')}</Title>
          <div>
            <Link to="/students/create">
              <DefaultButton type="button">
                {t('botoes.adicionar')}
              </DefaultButton>
            </Link>

            <SearchInput
              placeholder={t('alunos.placeholders.buscar')}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </>
      </HeaderDefault>
      <List>
        <table>
          <thead>
            <tr>
              <th>{t('alunos.table.header.1')}</th>
              <th>{t('alunos.table.header.2')}</th>
              <th>{t('alunos.table.header.3')}</th>
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.age}</td>
                <td>
                  <Link
                    className="editar"
                    to={`/students/update/${student.id}`}
                  >
                    {t('alunos.table.body.editar')}
                  </Link>
                </td>
                <td>
                  <button
                    type="button"
                    className="deletar"
                    onClick={() => handleDelete(student.id, index)}
                  >
                    {t('alunos.table.body.apagar')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <button
            type="button"
            onClick={() => handlePage('back')}
            disabled={page < 2}
          >
            <FaAngleLeft />
          </button>
          <span>1</span>
          <button
            type="button"
            onClick={() => handlePage('next')}
            disabled={!(students.length >= 5)}
          >
            <FaAngleRight />
          </button>
        </div>
      </List>
    </Container>
  );
}
