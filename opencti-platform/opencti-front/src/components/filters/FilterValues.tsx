import React, {Fragment, FunctionComponent} from "react";
import FilterIconButtonContent from "../FilterIconButtonContent";
import {last} from "ramda";
import Chip from "@mui/material/Chip";
import {useFormatter} from "../i18n";
import makeStyles from "@mui/styles/makeStyles";
import {Theme} from "../Theme";
import {Filter} from "../../utils/filters/filtersUtils";

const useStyles = makeStyles<Theme>((theme) => ({
  inlineOperator: {
    display: 'inline-block',
    height: '100%',
    borderRadius: 0,
    margin: '0 5px 0 5px',
    padding: '0 5px 0 5px',
    backgroundColor: 'rgba(255, 255, 255, .1)',
    fontFamily: 'Consolas, monaco, monospace',
  },
}));

interface FilterValuesProps {
  label: string;
  tooltip?: boolean;
  currentFilter: Filter;
  filtersRepresentatives: ReadonlyArray<{
    readonly id: string;
    readonly value: string | null;
  }>;
  redirection?: boolean;
  handleSwitchLocalMode?: (filter: Filter) => void;
  onClickLabel?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const FilterValues: FunctionComponent<FilterValuesProps> = ({label, tooltip, currentFilter, filtersRepresentatives, redirection, handleSwitchLocalMode, onClickLabel}) => {
  const {t} = useFormatter();
  
  const filterKey = currentFilter.key;
  const filterOperator = currentFilter.operator;
  const filterValues = currentFilter.values;
  const isOperatorNil = ['nil', 'not_nil'].includes(filterOperator);
  const filtersRepresentativesMap = new Map(filtersRepresentatives.map((n) => [n.id, n.value]));
  const classes = useStyles();
  
  if (isOperatorNil) {
    return <span>{t('No value')}</span>
  }
  
  const values = filterValues.map((id) => {
    return (
      <Fragment key={id}>
        {filtersRepresentativesMap.has(id)
          && (<FilterIconButtonContent
            redirection={tooltip ? false : redirection}
            isFilterTooltip={!!tooltip}
            filterKey={filterKey}
            id={id}
            value={filtersRepresentativesMap.get(id)}
          ></FilterIconButtonContent>)
        }
        {last(filterValues) !== id && (
          <Chip
            className={classes.inlineOperator}
            label={t((currentFilter.mode ?? 'or').toUpperCase())}
            onClick={() => handleSwitchLocalMode?.(currentFilter)}
          />
        )}{' '}
      </Fragment>
    );
  })
  return <>
    <strong onClick={onClickLabel}>{label}</strong> : {values}
  </>
  
}