import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Text, View } from 'react-native';

const CodeCssList = () => {
  const [rows, setRows] = useState<string[][]>([]);
  const [current, setCurrent] = useState(0);
  const difference = 10;

  // Calculate item width based on screen width and number of items per row
  const screenWidth = Dimensions.get('window').width;
  const itemsPerRow = difference;
  const itemWidth = Math.floor((screenWidth - 122) / itemsPerRow); // 32 for padding

  useEffect(() => {
    if (current > 9999) return;
    const interval = setInterval(() => {
      const newRow: string[] = [];
      for (let i = current; i < current + difference && i <= 9999; i++) {
        newRow.push(i.toString().padStart(4, '0'));
      }
      setRows(prev => [...prev, newRow]);
      setCurrent(prev => prev + difference);
    }, 10);

    return () => clearInterval(interval);
  }, [current]);

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#222', width: '100%' }}>
      <FlatList
        data={rows}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', marginBottom: 8, flexWrap: 'nowrap' }}>
            {item.map(code => (
              <View
                key={code}
                style={{
                  alignItems: 'center',
                  width: itemWidth,
                  marginHorizontal: 1,
                }}
              >
                <View
                  style={{
                    backgroundColor: '#444',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: itemWidth - 2,
                    height: itemWidth - 2,
                    borderRadius: 6,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#fff',
                      fontWeight: 'bold',
                    }}
                  >
                    {String.fromCharCode(parseInt(code))}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#fff',
                    marginTop: 2,
                    textAlign: 'center',
                    paddingHorizontal: 2,
                    paddingVertical: 1,
                    alignSelf: 'center',
                  }}
                >
                  {code}
                </Text>
              </View>
            ))}
          </View>
        )}
      />
    </View>
  );
};

export default CodeCssList;