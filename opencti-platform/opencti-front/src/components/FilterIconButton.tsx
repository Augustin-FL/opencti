import React, { FunctionComponent } from 'react';
import { DataColumns } from './list_lines';
import { Filter, FilterGroup } from '../utils/filters/filtersUtils';
import { filterIconButtonContentQuery } from './FilterIconButtonContent';
import useQueryLoading from '../utils/hooks/useQueryLoading';
import Loader from './Loader';
import { FilterIconButtonContentQuery } from './__generated__/FilterIconButtonContentQuery.graphql';
import FilterIconButtonContainer from './FilterIconButtonContainer';

interface FilterIconButtonProps {
  availableFilterKeys?: string[];
  filters: FilterGroup;
  handleRemoveFilter?: (key: string, op?: string) => void;
  handleSwitchGlobalMode?: () => void;
  handleSwitchLocalMode?: (filter: Filter) => void;
  classNameNumber?: number;
  styleNumber?: number;
  chipColor?: string;
  dataColumns?: DataColumns;
  disabledPossible?: boolean;
  redirection?: boolean;
}

const FilterIconButton: FunctionComponent<FilterIconButtonProps> = ({
  availableFilterKeys,
  filters,
  handleRemoveFilter,
  handleSwitchGlobalMode,
  handleSwitchLocalMode,
  classNameNumber,
  styleNumber,
  dataColumns,
  disabledPossible,
  redirection,
  chipColor,
}) => {
  const displayedFilters = {
    ...filters,
    filters: filters.filters
      .filter((currentFilter) => !availableFilterKeys
        || availableFilterKeys?.some((k) => currentFilter.key === k)),
  };
  const { filterGroups } = filters;

  const filtersRepresentativesQueryRef = useQueryLoading<FilterIconButtonContentQuery>(
    filterIconButtonContentQuery,
    { filters: displayedFilters },
  );

  return (
    <>
    {filtersRepresentativesQueryRef && (
      <React.Suspense fallback={<Loader />}>
        <FilterIconButtonContainer
          handleRemoveFilter={handleRemoveFilter}
          handleSwitchGlobalMode={handleSwitchGlobalMode}
          handleSwitchLocalMode={handleSwitchLocalMode}
          styleNumber={styleNumber}
          chipColor={chipColor}
          disabledPossible={disabledPossible}
          redirection={redirection}
          filters={displayedFilters}
          filtersRepresentativesQueryRef={filtersRepresentativesQueryRef}
          filterGroups={filterGroups}
        ></FilterIconButtonContainer>
      </React.Suspense>)
    }
    </>
  );
};

export default FilterIconButton;
