import React, { useEffect, useState } from 'react'
import { Loader, NoContent, Input } from 'UI';
import AlertItem from './AlertItem'
import { fetchList, init } from 'Duck/alerts';
import { connect } from 'react-redux';
import { getRE } from 'App/utils';

const AlertsList = props => {
  const { loading, list, instance, onEdit } = props;
  const [query, setQuery] = useState('')
  
  useEffect(() => {
    props.fetchList()
  }, [])

  const filterRE = getRE(query, 'i');
  const _filteredList = list.filter(({ name, query: { left } }) => filterRE.test(name) || filterRE.test(left));

  return (
    <div>
      <div className="mb-3 w-full px-3">
        <Input
          name="searchQuery"
          fluid
          placeholder="Search by Name or Metric"
          onChange={({ target: { value } }) => setQuery(value)}
        />
      </div>
      <Loader loading={ loading }>
        <NoContent
          title="No data available."
          size="small"
          show={ list.size === 0 }
        >
          <div className="bg-white">
            {_filteredList.map(a => (
              <div className="border-b" key={a.key}>
                <AlertItem
                  active={instance.alertId === a.alertId}
                  alert={a}
                  onEdit={() => onEdit(a.toData())}
                />
              </div>
            ))}
          </div>
        </NoContent>
      </Loader>
    </div>
  )
}

export default connect(state => ({
  list: state.getIn(['alerts', 'list']).sort((a, b ) => b.createdAt - a.createdAt),
  instance: state.getIn(['alerts', 'instance']),
  loading: state.getIn(['alerts', 'loading'])
}), { fetchList, init })(AlertsList)
