import React from 'react';
import styled from 'styled-components';
import { 
  FaUser, 
  FaCircle,   FaSquare,   FaFutbol, 
  FaFlag,   FaRegDotCircle,  FaArrowRight,
  FaCaretUp,
  FaHeadset,
  FaTable
} from 'react-icons/fa';
import { IoFootball } from 'react-icons/io5';
import { MdDirectionsRun, MdSportsScore } from 'react-icons/md';

// Vordefinierte Farboptionen für Teams
const teamColors = [
  { name: 'Rot', color: '#ff5252' },
  { name: 'Blau', color: '#4dabf5' },
  { name: 'Gelb', color: '#ffca28' },
  { name: 'Grün', color: '#66bb6a' },
  { name: 'Weiß', color: '#ffffff' },
  { name: 'Schwarz', color: '#212121' }
];

const ElementPalette = ({ onElementSelect, currentTeamColor }) => {
  // Kategorien von Übungselementen
  const elementCategories = [
    {
      name: 'Spieler',
      elements: [
        { 
          id: 'player', 
          icon: <FaUser />, 
          label: 'Spieler',
          defaultProps: { 
            type: 'player',
            color: currentTeamColor || teamColors[0].color,
            label: '',
            size: 30
          }
        },
        { 
          id: 'goalkeeper', 
          icon: <FaUser />, 
          label: 'Torwart',
          defaultProps: { 
            type: 'goalkeeper',
            color: '#FFA000',
            label: 'TW',
            size: 30
          }
        },
        {          id: 'coach', 
          icon: <FaHeadset />, 
          label: 'Trainer',
          defaultProps: { 
            type: 'coach',
            color: '#9E9E9E',
            label: 'T',
            size: 30
          }
        }
      ]
    },
    {
      name: 'Materialien',
      elements: [
        { 
          id: 'ball', 
          icon: <IoFootball />, 
          label: 'Ball',
          defaultProps: { 
            type: 'ball',
            color: '#000000',
            size: 20
          }
        },
        {          id: 'cone', 
          icon: <FaCaretUp />, 
          label: 'Hütchen',
          defaultProps: { 
            type: 'cone',
            color: '#FF9800',
            size: 20
          }
        },
        { 
          id: 'pole', 
          icon: <FaFlag />, 
          label: 'Stange',
          defaultProps: { 
            type: 'pole',
            color: '#F44336',
            size: 24
          }
        },
        { 
          id: 'marker', 
          icon: <FaRegDotCircle />, 
          label: 'Markierung',
          defaultProps: { 
            type: 'marker',
            color: '#FFEB3B',
            size: 15
          }
        },
        { 
          id: 'goal', 
          icon: <FaSquare />, 
          label: 'Tor',
          defaultProps: { 
            type: 'goal',
            color: '#616161',
            width: 60,
            height: 20
          }
        }
      ]
    },
    {
      name: 'Bewegungen',
      elements: [
        { 
          id: 'movement', 
          icon: <MdDirectionsRun />, 
          label: 'Laufweg',
          defaultProps: { 
            type: 'movement',
            color: '#000000',
            size: 2,
            dashArray: [10, 5]
          }
        },
        { 
          id: 'pass', 
          icon: <FaArrowRight />, 
          label: 'Pass',
          defaultProps: { 
            type: 'pass',
            color: '#2196F3',
            size: 2
          }
        },        { 
          id: 'shot', 
          icon: <MdSportsScore />, 
          label: 'Schuss',
          defaultProps: { 
            type: 'shot',
            color: '#F44336',
            size: 3
          }
        }
      ]
    },
    {
      name: 'Felder',
      elements: [
        {          id: 'field', 
          icon: <FaTable />, 
          label: 'Spielfeld',
          defaultProps: { 
            type: 'field',
            color: '#4CAF50',
            width: 400,
            height: 250
          }
        },        { 
          id: 'area', 
          icon: <FaCircle />, 
          label: 'Zone',
          defaultProps: { 
            type: 'area',
            color: 'rgba(33, 150, 243, 0.3)',
            width: 100,
            height: 100
          }
        }
      ]
    }
  ];
  
  return (
    <PaletteContainer>
      <PaletteHeader>Elemente</PaletteHeader>
      
      <TeamColorSelector>
        <label>Team-Farbe:</label>
        <div className="color-options">
          {teamColors.map((team) => (
            <ColorOption 
              key={team.name}
              color={team.color}
              title={team.name}
              onClick={() => onElementSelect('teamColor', { color: team.color })}
              className={currentTeamColor === team.color ? 'active' : ''}
            />
          ))}
        </div>
      </TeamColorSelector>
      
      {elementCategories.map(category => (
        <CategorySection key={category.name}>
          <CategoryTitle>{category.name}</CategoryTitle>
          <ElementsGrid>
            {category.elements.map(element => (
              <ElementButton 
                key={element.id}
                onClick={() => onElementSelect('element', element.defaultProps)}
                title={element.label}
              >
                <ElementIcon>{element.icon}</ElementIcon>
                <ElementLabel>{element.label}</ElementLabel>
              </ElementButton>
            ))}
          </ElementsGrid>
        </CategorySection>
      ))}
      
      <HelpText>
        Tipp: Elemente können nach dem Platzieren verschoben, gedreht und gelöscht werden.
      </HelpText>
    </PaletteContainer>
  );
};

// Styled Components
const PaletteContainer = styled.div`
  background-color: #f5f5f5;
  border-right: 1px solid #e0e0e0;
  width: 240px;
  height: 100%;
  overflow-y: auto;
  padding: 16px;
`;

const PaletteHeader = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #424242;
`;

const TeamColorSelector = styled.div`
  margin-bottom: 20px;
  
  label {
    display: block;
    font-size: 14px;
    margin-bottom: 8px;
    color: #616161;
  }
  
  .color-options {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
`;

const ColorOption = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${props => props.color};
  cursor: pointer;
  border: 2px solid #e0e0e0;
  transition: transform 0.2s, border-color 0.2s;
  
  &:hover {
    transform: scale(1.1);
  }
  
  &.active {
    border-color: #2196F3;
    transform: scale(1.1);
  }
`;

const CategorySection = styled.div`
  margin-bottom: 20px;
`;

const CategoryTitle = styled.h4`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #616161;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 4px;
`;

const ElementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

const ElementButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 8px 4px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
  
  &:hover {
    background-color: #f0f7ff;
    transform: translateY(-2px);
  }
`;

const ElementIcon = styled.span`
  font-size: 20px;
  margin-bottom: 4px;
  color: #424242;
`;

const ElementLabel = styled.span`
  font-size: 11px;
  color: #616161;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

const HelpText = styled.p`
  font-size: 12px;
  color: #757575;
  margin-top: 20px;
  line-height: 1.4;
`;

export default ElementPalette;
