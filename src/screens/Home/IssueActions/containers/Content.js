import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ToastAndroid,
  Linking
} from 'react-native';
import { Button, Dialog, Paragraph, Portal, TextInput, RadioButton, IconButton } from 'react-native-paper';
import moment from 'moment';
import { AntDesign, Feather } from '@expo/vector-icons';
import { colors } from '../../../../utils/colors';
import { styles } from './Content.styles';
import { LocalGRMDatabase } from '../../../../utils/databaseManager';
import i18n from 'i18n-js';
import StarRating from 'react-native-star-rating-widget';

const theme = {
  roundness: 12,
  colors: {
    ...colors,
    background: 'white',
    placeholder: '#dedede',
    text: '#707070',
  },
};

const WHATSAPP_LINK = 'http://api.whatsapp.com/send?phone=223';
const PHONE_CALL_LINK = 'tel://+223';

function Content({ issue, navigation, statuses = [], eadl }) {
  const [acceptDialog, setAcceptDialog] = useState(false);
  const [rejectDialog, setRejectDialog] = useState(false);
  const [recordStepsDialog, setRecordStepsDialog] = useState(false);
  const [escalateDialog, setEscalateDialog] = useState(false);
  const [recordResolutionDialog, setRecordResolutionDialog] = useState(false);
  const [acceptedDialog, setAcceptedDialog] = useState(false);
  const [rejectedDialog, setRejectedDialog] = useState(false);
  const [escalatedDialog, setEscalatedDialog] = useState(false);
  const [disableEscalation, setDisableEscalation] = useState(false);
  const [rateAppealDialog, setRateAppealDialog] = useState(false);
  const [ratingDialog, setRatingDialog] = useState(false);
  const [recordedSteps, setRecordedSteps] = useState(false);
  const [recordedResolution, setRecordedResolution] = useState(false);
  const [currentDate, setCurrentDate] = useState(moment());
  const [citizenName, setCitizenName] = useState();
  const [reason, onChangeReason] = useState('');
  const [escalateComment, onChangeEscalateComment] = useState('');
  const [comment, onChangeComment] = useState('');
  const [resolution, onChangeResolution] = useState('');
  const [isAcceptEnabled, setIsAcceptEnabled] = useState(false);
  const [isRecordResolutionEnabled, setIsRecordResolutionEnabled] = useState(false);
  const [isRateAppealEnabled, setIsRateAppealEnabled] = useState(false);
  const [isIssueAssignedToMe, setIsIssueAssignedToMe] = useState(false);
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState(null);
  const goToDetails = () => navigation.jumpTo('IssueDetail');
  const goToHistory = () => {
    setRecordedSteps(false);
    _hideRecordStepsDialog();
    navigation.jumpTo('History');
  };
  const _showDialog = () => setAcceptDialog(true);
  const _showEscalateDialog = () => setEscalateDialog(true);
  const _showRecordStepsDialog = () => setRecordStepsDialog(true);
  const _hideRecordStepsDialog = () => setRecordStepsDialog(false);
  const _hideEscalateDialog = () => setEscalateDialog(false);
  const _showRecordResolutionDialog = () => setRecordResolutionDialog(true);
  const _hideRecordResolutionDialog = () => setRecordResolutionDialog(false);
  const _showRateAppealDialog = () => {
    _hideRatingDialog();
    setRateAppealDialog(true);
  };
  const _hideRateAppealDialog = () => setRateAppealDialog(false);
  const _showRatingDialog = () => setRatingDialog(true);
  const _hideRatingDialog = () => setRatingDialog(false);
  const _hideDialog = () => setAcceptDialog(false);
  const _showRejectDialog = () => {
    _hideDialog();
    setRejectDialog(true);
  };
  const _hideRejectDialog = () => setRejectDialog(false);

  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  const updateActionButtons = () => {
    function _isAcceptEnabled(x) {
      if (x.initial_status && isIssueAssignedToMe) {
        return issue.status?.id === x.id;
      }
    }

    function _isRecordResolutionEnabled(x) {
      if (x.open_status && isIssueAssignedToMe) {
        return issue.status?.id === x.id && !issue.escalate_flag;
      }
    }

    function _isRateAppealEnabled(x) {
      if (x.final_status && !isIssueAssignedToMe) {
        return issue.status?.id === x.id;
      }
    }

    if (statuses) {
      setIsAcceptEnabled(statuses.some(_isAcceptEnabled));
      setIsRecordResolutionEnabled(statuses.some(_isRecordResolutionEnabled));
      setIsRateAppealEnabled(statuses.some(_isRateAppealEnabled));
    }
  };

  const whatsApp = () => {
    Linking.openURL(WHATSAPP_LINK + issue.contact_information.contact)
      .then(value => {
        console.log('whatsapp result: ', value);
      }).catch(reason1 => {
      console.error('Oups! An error occurred', reason1);
    });
  };

  const phoneCall = () => {
    Linking.openURL(PHONE_CALL_LINK + issue.contact_information.contact)
      .then(value => {
        console.log('phone_call result: ', value);
      }).catch(reason1 => {
      console.error('phone_call: Oups! An error occurred', reason1);
    });
  };

  const acceptIssue = () => {
    const newStatus = statuses.find((x) => x.open_status === true);
    issue.comments?.push({
      name: issue.reporter.name,
      id: eadl._id,
      comment: i18n.t('issue_was_accepted'),
      due_at: moment(),
    });
    saveIssueStatus(newStatus, 'accept');
  };

  const rejectIssue = () => {
    const newStatus = statuses.find((x) => x.rejected_status === true);
    issue.comments?.push({
      name: issue.reporter.name,
      id: eadl._id,
      comment: i18n.t('issue_was_rejected'),
      due_at: moment(),
    });
    saveIssueStatus(newStatus, 'reject');
  };

  const rateIssue = () => {
    if (rating > 0) {
      issue.comments?.push({
        name: issue.reporter.name,
        id: eadl._id,
        comment: i18n.t('issue_was_rated'),
        due_at: moment(),
      });
    }

    issue.rating = rating;
    saveIssueStatus();

    if (rating === 0) {
      _showRateAppealDialog();
    }
    _hideRatingDialog();
  };

  const appealIssue = () => {
    const newStatus = statuses.find((x) => x.open_status === true);
    issue.comments?.push({
      name: issue.reporter.name,
      id: eadl._id,
      comment: i18n.t('issue_was_appealed'),
      due_at: moment(),
    });
    issue.escalate_flag = true;
    saveIssueStatus(newStatus);
    _hideRateAppealDialog();
    showToast('Votre demande a bien été prise en compte.');
  };

  const escalateIssue = () => {
    issue.escalate_flag = true;
    issue.escalation_reasons?.push({
      id: eadl?._id,
      name: eadl?.representative?.name,
      comment: escalateComment,
      due_at: moment(),
    });
    issue.comments?.push({
      name: issue.reporter.name,
      id: eadl._id,
      comment: i18n.t('issue_was_escalated'),
      due_at: moment(),
    });
    saveIssueStatus();
    setDisableEscalation(true);
    setEscalatedDialog(true);
  };

  const recordStep = () => {
    issue.comments?.push({
      name: issue.reporter.name,
      id: eadl._id,
      comment,
      due_at: moment(),
    });
    saveIssueStatus();
    setRecordedSteps(true);
  };

  const recordResolution = () => {
    setRecordedResolution(true);
  };

  const recordResolutionConfirmation = () => {
    issue.research_result = resolution;
    const newStatus = statuses.find((x) => x.final_status === true);
    issue.comments?.push({
      name: issue.reporter.name,
      id: eadl._id,
      comment: i18n.t('issue_was_resolved'),
      due_at: moment(),
    });
    saveIssueStatus(newStatus, 'record_resolution');
    _hideRecordResolutionDialog();
  };

  const saveIssueStatus = (newStatus, type = 'none') => {
    if (newStatus) {
      issue.status = {
        id: newStatus.id,
        name: newStatus.name,
      };
    }
    if (type === 'rejected') {
      issue.reject_reason = reason;
    }
    LocalGRMDatabase.upsert(issue._id, (doc) => {
      doc = issue;
      return doc;
    })
      .then(() => {
        updateActionButtons();
        if (type === 'accept') {
          setAcceptedDialog(true);
        } else if (type === 'reject') {
          setRejectedDialog(true);
        } else if (type === 'record_resolution') {
          setRecordedResolution(false);
          _hideRecordResolutionDialog();
        }
      })
      .catch((err) => {
        console.log('Error', err);
      });
  };

  useEffect(() => {
    function _isIssueAssignedToMe() {
      if (issue.assignee && issue.assignee.id) {
        return issue.reporter.id === issue.assignee.id || issue.assignee.id === eadl?._id;
      }
      return false;
    }

    setIsIssueAssignedToMe(_isIssueAssignedToMe());

    if (issue.citizen_type !== 1) {
      setCitizenName(issue.citizen);
    } else if (issue.citizen_type === 1) {
      setCitizenName(_isIssueAssignedToMe() ? issue.citizen : 'Anonymous');
    }

    if (issue.rating) {
      setRating(issue.rating);
    }
    updateActionButtons();
  });

  return (
    <ScrollView>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : null}>
        <View style={{ padding: 23 }}>
          <Text style={styles.stepDescription}>
            {citizenName}, {issue.intake_date && moment(issue.intake_date).format('DD-MMM-YYYY')}{' '}
            {issue.intake_date && currentDate.diff(issue.intake_date, 'days')} {i18n.t('days_ago')}
          </Text>
          <Text style={styles.stepDescription}>
            {i18n.t('status_label')}: <Text
            style={{ color: ((issue.status?.id === 1 || issue.status?.id === 2) ? colors.inProgress : colors.primary) }}>{issue.status?.name}</Text>
          </Text>
          <Text style={styles.stepNote}>{issue.description?.substring(0, 170)}</Text>
          <View style={styles.optionButtonContainer}>
            <Button
              theme={theme}
              style={{ alignSelf: 'center', margin: 24 }}
              labelStyle={{ color: 'white', fontFamily: 'Poppins_500Medium' }}
              mode="contained"
              onPress={goToDetails}
            >
              {i18n.t('view_details')}
            </Button>

            {/* THROUGH THOSE BUTTONS OYU CAN MAKE A WHATSAPP CALL, PHONE CALL AND SEND EMAIL TO THE COMPLAINER */}
            {issue.contact_information && issue.contact_information.contact !== '*' &&
            (
              <>
                {issue.contact_information.type === 'phone_number' ?
                  (
                    <IconButton
                      icon="phone"
                      color={colors.primary}
                      size={35}
                      onPress={() => phoneCall()}
                    />
                  ) : issue.contact_information.type === 'whatsapp' ?
                    (
                      <IconButton
                        icon="whatsapp"
                        color={colors.primary}
                        size={35}
                        onPress={() => whatsApp()}
                      />
                    ) : (<></>)
                }
              </>
            )
            }

          </View>

          <View style={styles.ratingInfoSection}>
            {
              !issue.rating ?
                (
                  <Text style={styles.radioLabel}>{i18n.t('not_rate_yet')}</Text>
                ) : (
                  <Text style={styles.radioLabel}>{i18n.t(`satisfaction_level_${issue.rating}`)}</Text>
                )
            }
            <StarRating
              starSize={30}
              rating={() => issue.rating ? issue.rating : 0}
              maxStars={5}
              onChange={() => null}
              emptyColor="#dddddd"/>

          </View>

          {/* ACTION BUTTONS */}
          <View style={{ borderWidth: 1, borderRadius: 15, padding: 15, borderColor: colors.lightgray }}>
            <TouchableOpacity
              onPress={() => _showDialog()}
              disabled={!isAcceptEnabled}
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 10,
              }}
            >
              <Text style={styles.subtitle}>{i18n.t('accept_issue')}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AntDesign
                  style={{ marginRight: 5 }}
                  name="rightsquare"
                  size={35}
                  color={isAcceptEnabled ? colors.primary : colors.disabled}
                />
                <Feather name="help-circle" size={24} color="gray"/>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={_showRecordStepsDialog}
              disabled={!isRecordResolutionEnabled}
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 10,
              }}
            >
              <Text style={styles.subtitle}>{i18n.t('record_steps_taken')}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AntDesign
                  style={{ marginRight: 5 }}
                  name="rightsquare"
                  size={35}
                  color={isRecordResolutionEnabled ? colors.primary : colors.disabled}
                />
                <Feather name="help-circle" size={24} color="gray"/>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={_showRecordResolutionDialog}
              disabled={!isRecordResolutionEnabled}
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 10,
              }}
            >
              <Text style={styles.subtitle}>{i18n.t('record_resolution')}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AntDesign
                  style={{ marginRight: 5 }}
                  name="rightsquare"
                  size={35}
                  color={isRecordResolutionEnabled ? colors.primary : colors.disabled}
                />
                <Feather name="help-circle" size={24} color="gray"/>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={_showRatingDialog}
              disabled={!isRateAppealEnabled}
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 10,
              }}
            >
              <Text style={styles.subtitle}>{i18n.t('rate_appeal')}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AntDesign
                  style={{ marginRight: 5 }}
                  name="rightsquare"
                  size={35}
                  color={isRateAppealEnabled ? colors.primary : colors.disabled}
                />
                <Feather name="help-circle" size={24} color="gray"/>
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={_showEscalateDialog}
            disabled={disableEscalation || !isRecordResolutionEnabled}
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 10,
              padding: 15,
            }}
          >
            <Text style={styles.subtitle}>{i18n.t('escalate')}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AntDesign
                style={{ marginRight: 5 }}
                name="rightsquare"
                size={35}
                color={
                  !disableEscalation && isRecordResolutionEnabled ? colors.primary : colors.disabled
                }
              />
              <Feather name="help-circle" size={24} color="gray"/>
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* FEEDBACK AND APPEAL MODAL */}
      <Portal>
        <Dialog visible={rateAppealDialog} onDismiss={_hideRateAppealDialog}>
          <Dialog.Title>{i18n.t('confirmation')}?</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              {i18n.t('confirm_your_choice')}
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              theme={theme}
              style={{
                alignSelf: 'center',
                backgroundColor: '#E74C3C',
                paddingLeft: 15,
                paddingRight: 15,
              }}
              labelStyle={{ color: 'white', fontFamily: 'Poppins_500Medium' }}
              mode="contained"
              onPress={_hideRateAppealDialog}
            >
              {i18n.t('no')}
            </Button>
            <Button
              theme={theme}
              style={{ alignSelf: 'center', margin: 24, paddingLeft: 15, paddingRight: 15 }}
              labelStyle={{ color: 'white', fontFamily: 'Poppins_500Medium' }}
              mode="contained"
              onPress={appealIssue}
            >
              {i18n.t('yes')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* RATING MODAL */}
      <Portal>
        <Dialog visible={ratingDialog} onDismiss={_hideRatingDialog}>
          <Dialog.Title>{i18n.t('rating')}?</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              {i18n.t('rate_issue')}
            </Paragraph>
            <RadioButton.Group
              onValueChange={(newValue) => {
                if (newValue === rating) {
                  setRating(0);
                } else {
                  setRating(newValue);
                }
              }}
              value={rating}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                <RadioButton.Android value={5} uncheckedColor="#dedede" color={colors.primary}/>
                <Text style={styles.radioLabel}>
                  {i18n.t('satisfaction_level_5')}{' '}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                <RadioButton.Android value={4} uncheckedColor="#dedede" color={colors.primary}/>
                <Text style={styles.radioLabel}>
                  {i18n.t('satisfaction_level_4')}{' '}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                <RadioButton.Android value={3} uncheckedColor="#dedede" color={colors.primary}/>
                <Text style={styles.radioLabel}>
                  {i18n.t('satisfaction_level_3')}{' '}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                <RadioButton.Android value={2} uncheckedColor="#dedede" color={colors.primary}/>
                <Text style={styles.radioLabel}>
                  {i18n.t('satisfaction_level_2')}{' '}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                <RadioButton.Android value={1} uncheckedColor="#dedede" color={colors.primary}/>
                <Text style={styles.radioLabel}>
                  {i18n.t('satisfaction_level_1')}{' '}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                <RadioButton.Android value={0} uncheckedColor="#dedede" color={colors.primary}/>
                <Text style={styles.radioLabel}>
                  {i18n.t('satisfaction_level_0')}{' '}
                </Text>
              </View>
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              theme={theme}
              style={{ alignSelf: 'center', backgroundColor: '#d4d4d4' }}
              labelStyle={{ color: 'white', fontFamily: 'Poppins_500Medium' }}
              mode="contained"
              onPress={_hideRatingDialog}
            >
              {i18n.t('cancel')}
            </Button>
            <Button
              theme={theme}
              style={{ alignSelf: 'center', margin: 24 }}
              labelStyle={{ color: 'white', fontFamily: 'Poppins_500Medium' }}
              mode="contained"
              onPress={rateIssue}
            >
              {i18n.t('save_button_text')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* REJECT MODAL */}
      <Portal>
        <Dialog visible={rejectDialog} onDismiss={_hideRejectDialog}>
          <Dialog.Content>
            {!rejectedDialog ? (
              <Paragraph>
                {i18n.t('you_are_rejecting')}
              </Paragraph>
            ) : (
              <Paragraph>
                {i18n.t('complaint_rejected')}
              </Paragraph>
            )}
            {!rejectedDialog && (
              <TextInput
                multiline
                style={{ marginTop: 10 }}
                mode="outlined"
                theme={theme}
                onChangeText={onChangeReason}
              />
            )}
          </Dialog.Content>
          {!rejectedDialog ? (
            <Dialog.Actions>
              <Button
                theme={theme}
                style={{ alignSelf: 'center', backgroundColor: '#d4d4d4' }}
                labelStyle={{ color: 'white', fontFamily: 'Poppins_500Medium' }}
                mode="contained"
                onPress={_hideRejectDialog}
              >
                {i18n.t('cancel')}
              </Button>
              <Button
                disabled={reason === ''}
                theme={theme}
                style={{ alignSelf: 'center', margin: 24 }}
                labelStyle={{ color: 'white', fontFamily: 'Poppins_500Medium' }}
                mode="contained"
                onPress={rejectIssue}
              >
                {i18n.t('submit')}
              </Button>
            </Dialog.Actions>
          ) : (
            <Dialog.Actions>
              <Button
                theme={theme}
                style={{ alignSelf: 'center', margin: 24 }}
                labelStyle={{ color: 'white', fontFamily: 'Poppins_500Medium' }}
                mode="contained"
                onPress={_hideRejectDialog}
              >
                {i18n.t('finished')}
              </Button>
            </Dialog.Actions>
          )}
        </Dialog>
      </Portal>

      {/* ACCEPT MODAL */}
      <Portal>
        <Dialog visible={acceptDialog} onDismiss={_hideDialog}>
          {!acceptedDialog && <Dialog.Title>{i18n.t('accept_issue')}?</Dialog.Title>}
          <Dialog.Content>
            {!acceptedDialog ? (
              <Paragraph>
                {i18n.t('are_you_accepting')}
              </Paragraph>
            ) : (
              <Paragraph>
                {i18n.t('you_have_accepted')}
              </Paragraph>
            )}
          </Dialog.Content>
          {!acceptedDialog ? (
            <Dialog.Actions>
              <Button
                theme={theme}
                style={{ alignSelf: 'center', backgroundColor: '#d4d4d4' }}
                labelStyle={{ color: 'white', fontFamily: 'Poppins_500Medium' }}
                mode="contained"
                onPress={_showRejectDialog}
              >
                {i18n.t('reject')}
              </Button>
              <Button
                theme={theme}
                style={{ alignSelf: 'center', margin: 24 }}
                labelStyle={{ color: 'white', fontFamily: 'Poppins_500Medium' }}
                mode="contained"
                onPress={acceptIssue}
              >
                {i18n.t('accept')}
              </Button>
            </Dialog.Actions>
          ) : (
            <Dialog.Actions>
              <Button
                theme={theme}
                style={{ alignSelf: 'center', margin: 24 }}
                labelStyle={{ color: 'white', fontFamily: 'Poppins_500Medium' }}
                mode="contained"
                onPress={_hideDialog}
              >
                {i18n.t('finished')}
              </Button>
            </Dialog.Actions>
          )}
        </Dialog>
      </Portal>

      {/* ESCALATE MODAL */}
      <Portal>
        <Dialog visible={escalateDialog} onDismiss={_hideEscalateDialog}>
          <Dialog.Content>
            {!escalatedDialog ? (
              <Paragraph>
                {i18n.t('you_are_escalating')}
              </Paragraph>
            ) : (
              <Paragraph>
                {i18n.t('escalated_text')}
              </Paragraph>
            )}
            {!escalatedDialog && (
              <TextInput
                multiline
                style={{ marginTop: 10 }}
                mode="outlined"
                theme={theme}
                onChangeText={onChangeEscalateComment}
              />
            )}
          </Dialog.Content>
          {!escalatedDialog ? (
            <Dialog.Actions>
              <Button
                theme={theme}
                style={{ alignSelf: 'center', backgroundColor: '#d4d4d4' }}
                labelStyle={{ color: 'white', fontFamily: 'Poppins_500Medium' }}
                mode="contained"
                onPress={_hideEscalateDialog}
              >
                {i18n.t('cancel')}
              </Button>
              <Button
                disabled={escalateComment === ''}
                theme={theme}
                style={{ alignSelf: 'center', margin: 24 }}
                labelStyle={{ color: 'white', fontFamily: 'Poppins_500Medium' }}
                mode="contained"
                onPress={escalateIssue}
              >
                {i18n.t('submit')}
              </Button>
            </Dialog.Actions>
          ) : (
            <Dialog.Actions>
              <Button
                theme={theme}
                style={{ alignSelf: 'center', margin: 24 }}
                labelStyle={{ color: 'white', fontFamily: 'Poppins_500Medium' }}
                mode="contained"
                onPress={() => {
                  _hideEscalateDialog();
                  setEscalatedDialog(false);
                }}
              >
                {i18n.t('finished')}
              </Button>
            </Dialog.Actions>
          )}
        </Dialog>
      </Portal>

      {/* RECORD STEPS MODAL */}
      <Portal>
        <Dialog visible={recordStepsDialog} onDismiss={_hideRecordStepsDialog}>
          <Dialog.Content>
            {!recordedSteps ? (
              <Paragraph>
                {i18n.t('record_steps_text')}
              </Paragraph>
            ) : (
              <Paragraph>
                {i18n.t('recorded_comment')}
              </Paragraph>
            )}
            {!recordedSteps && (
              <TextInput
                multiline
                style={{ marginTop: 10 }}
                mode="outlined"
                theme={theme}
                onChangeText={onChangeComment}
              />
            )}
          </Dialog.Content>
          {!recordedSteps ? (
            <Dialog.Actions>
              <Button
                theme={theme}
                style={{ alignSelf: 'center', backgroundColor: '#d4d4d4' }}
                labelStyle={{ color: 'white', fontFamily: 'Poppins_500Medium' }}
                mode="contained"
                onPress={_hideRecordStepsDialog}
              >
                {i18n.t('cancel')}
              </Button>
              <Button
                disabled={comment === ''}
                theme={theme}
                style={{ alignSelf: 'center', margin: 24 }}
                labelStyle={{ color: 'white', fontFamily: 'Poppins_500Medium' }}
                mode="contained"
                onPress={recordStep}
              >
                {i18n.t('submit')}
              </Button>
            </Dialog.Actions>
          ) : (
            <Dialog.Actions>
              <Button
                theme={theme}
                style={{ alignSelf: 'center', margin: 24 }}
                labelStyle={{ color: 'white', fontFamily: 'Poppins_500Medium' }}
                mode="contained"
                onPress={() => {
                  _hideRecordStepsDialog();
                  setRecordedSteps(false);
                }}
              >
                {i18n.t('finished')}
              </Button>
              <Button
                theme={theme}
                style={{ alignSelf: 'center', margin: 24 }}
                labelStyle={{ color: 'white', fontFamily: 'Poppins_500Medium' }}
                mode="contained"
                onPress={goToHistory}
              >
                {i18n.t('view_history')}
              </Button>
            </Dialog.Actions>
          )}
        </Dialog>
      </Portal>

      <Portal>
        <Dialog visible={recordResolutionDialog} onDismiss={_hideRecordResolutionDialog}>
          <Dialog.Content>
            {!recordedResolution ? (
              <Paragraph>{i18n.t('summarize_resolution')}</Paragraph>
            ) : (
              <Paragraph>{i18n.t('please_confirm_resolution')}</Paragraph>
            )}
            {!recordedResolution ? (
              <TextInput
                multiline
                style={{ marginTop: 10 }}
                mode="outlined"
                theme={theme}
                onChangeText={onChangeResolution}
              />
            ) : (
              <Text>
                {'\n'}"{resolution}"
              </Text>
            )}
          </Dialog.Content>
          {!recordedResolution ? (
            <Dialog.Actions>
              <Button
                theme={theme}
                style={{ alignSelf: 'center', backgroundColor: '#d4d4d4' }}
                labelStyle={{ color: 'white', fontFamily: 'Poppins_500Medium' }}
                mode="contained"
                onPress={_hideRecordResolutionDialog}
              >
                {i18n.t('cancel')}
              </Button>
              <Button
                disabled={resolution === ''}
                theme={theme}
                style={{ alignSelf: 'center', margin: 24 }}
                labelStyle={{ color: 'white', fontFamily: 'Poppins_500Medium' }}
                mode="contained"
                onPress={recordResolution}
              >
                {i18n.t('submit')}
              </Button>
            </Dialog.Actions>
          ) : (
            <Dialog.Actions>
              <Button
                theme={theme}
                style={{ alignSelf: 'center', backgroundColor: '#d4d4d4' }}
                labelStyle={{ color: 'white', fontFamily: 'Poppins_500Medium' }}
                mode="contained"
                onPress={() => setRecordedResolution(false)}
              >
                {i18n.t('cancel')}
              </Button>
              <Button
                theme={theme}
                style={{ alignSelf: 'center', margin: 24 }}
                labelStyle={{ color: 'white', fontFamily: 'Poppins_500Medium' }}
                mode="contained"
                onPress={recordResolutionConfirmation}
              >
                {i18n.t('confirm')}
              </Button>
            </Dialog.Actions>
          )}
        </Dialog>
      </Portal>
    </ScrollView>
  );
}

export default Content;
