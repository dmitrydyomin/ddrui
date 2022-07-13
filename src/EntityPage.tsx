import React from 'react';
import { Form } from 'react-final-form';
import { FaChevronLeft, FaPlus } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';

import { DeleteButton } from './DeleteButton';
import type { Entity } from './api/types';
import { useItem } from './api/useItem';
import { useAPI } from './auth/api';

interface EntityPageProps<T> {
  apiPath?: string;
  form: React.ReactNode;
  listHeader: React.ReactNode;
  listRow: React.FC<{ item: T; path: string }>;
  path: string;
  plural: string;
  singular: string;
}

export function EntityPage<T extends Entity>({
  apiPath,
  form,
  listHeader,
  listRow,
  path,
  plural,
  singular,
}: EntityPageProps<T>): React.ReactElement {
  const { id } = useParams();

  const { data } = useAPI<T[]>(apiPath || path);
  const item = useItem<T>(apiPath || path, id);

  if (id === undefined) {
    const ListRow = listRow;
    return (
      <>
        <div className="d-flex align-items-center">
          <h3 className="my-3 me-2">{plural}</h3>
          <Link className="btn btn-secondary" to={`${path}/create`}>
            <FaPlus />
          </Link>
        </div>

        {data && (
          <table className="table">
            <thead>
              <tr>{listHeader}</tr>
            </thead>
            <tbody>
              {data.map((i) => (
                <tr key={i.id}>{<ListRow item={i} path={path} />}</tr>
              ))}
            </tbody>
          </table>
        )}
      </>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link className="btn btn-secondary me-2" to={path}>
          <FaChevronLeft />
        </Link>
        <h3 className="my-3 me-auto">{singular}</h3>
        <DeleteButton onClick={item.del} />
      </div>

      <Form initialValues={item.data} onSubmit={item.save}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            {form}
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </form>
        )}
      </Form>
    </div>
  );
}
