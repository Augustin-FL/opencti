import { HandleAddFilter, UseLocalStorageHelpers } from '../../utils/hooks/useLocalStorage';
import { PaginationOptions } from '../list_lines';

let handleAddFilter: HandleAddFilter | undefined;
let handleRemoveFilter: ((key: string, id?: string) => void) | undefined;
let filterHelpers: UseLocalStorageHelpers | undefined;
export namespace FiltersHelpersUtil {
  export const setHandleAddFilter = (addFilter?: HandleAddFilter) => {
    handleAddFilter = addFilter;
  };
  export const useHandleAddFilter: HandleAddFilter = (k, id, op, event) => {
    if (handleAddFilter) {
      handleAddFilter(k, id, op, event);
    }
  };

  export const setFilterHelpers = (helpers: UseLocalStorageHelpers) => {
    filterHelpers = helpers;
  };

  export const getFilterHelpers = () => {
    return filterHelpers;
  };
  export const setHandleRemoveFilter = (removeFilter?: (key: string, id?: string) => void) => {
    handleRemoveFilter = removeFilter;
  };

}
