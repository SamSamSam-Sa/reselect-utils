import React, { useEffect, useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { createSelector } from 'reselect';
import {
  selectorGraph,
  registerSelectors,
  reset,
  Nodes,
  Edges,
} from 'reselect-tools';
import { SelectorGraph } from './SelectorGraph';
import { State } from '../__data__/state';
import { createPathSelector } from '../createPathSelector';

const personSelector = (state: State, props: { personId: number }) =>
  state.persons[props.personId];

storiesOf('createPathSelector', module).add('example', () => {
  const [nodes, setNodes] = useState<Nodes>({});
  const [edges, setEdges] = useState<Edges>([]);

  useEffect(() => {
    const personFullNameSelector = createSelector(
      createPathSelector(personSelector).firstName(''),
      createPathSelector(personSelector).secondName(''),
      (firstName, secondName) => `${firstName} ${secondName}`,
    );

    const personShortNameSelector = createSelector(
      createPathSelector(personSelector).firstName(''),
      createPathSelector(personSelector).secondName(''),
      (firstName, secondName) => {
        const [firstLetter] = Array.from(secondName);
        return `${firstName} ${firstLetter}.`;
      },
    );

    reset();
    registerSelectors({
      personSelector,
      personFullNameSelector,
      personShortNameSelector,
    });

    const graph = selectorGraph();

    setNodes(graph.nodes);
    setEdges(graph.edges);
  }, [setNodes, setEdges]);

  return (
    <SelectorGraph
      nodes={nodes}
      edges={edges}
      onNodeClick={(name, node) => action(name)(node)}
    />
  );
});
