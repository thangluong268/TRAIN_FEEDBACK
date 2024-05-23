import * as fs from 'fs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vntk = require('vntk');

export const saveClassifier = (classifier, filePath: string) => {
  const classifierData = {
    docCount: classifier.docCount,
    vocabulary: classifier.vocabulary,
    vocabularySize: classifier.vocabularySize,
    totalDocuments: classifier.totalDocuments,
    classFeatures: classifier.classFeatures,
    classCounts: classifier.classCounts,
    classes: classifier.classes,
    smoothing: classifier.smoothing,
  };

  fs.writeFileSync(filePath, JSON.stringify(classifierData, null, 2));
  console.log('Classifier đã được lưu thành công');
};

export const loadClassifier = (filePath: string) => {
  const classifierData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const classifier = new vntk.BayesClassifier();

  classifier.docCount = classifierData.docCount;
  classifier.vocabulary = classifierData.vocabulary;
  classifier.vocabularySize = classifierData.vocabularySize;
  classifier.totalDocuments = classifierData.totalDocuments;
  classifier.classFeatures = classifierData.classFeatures;
  classifier.classCounts = classifierData.classCounts;
  classifier.classes = classifierData.classes;
  classifier.smoothing = classifierData.smoothing;

  return classifier;
};
