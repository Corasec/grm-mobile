import UserAvatar from '@muhzi/react-native-user-avatar';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { baseURL } from '../../../../services/authService';
import { logout } from '../../../../store/ducks/authentication.duck';
import { i18n } from "../../../../translations/i18n";
import {
  getAccountLabel,
  getCoveredVillages,
  getLocationLabel,
  getReporterCounters,
  isCommittee,
  isFacilitator,
} from '../../../../utils/account';
import { appVersion } from '../../../../utils/appVersion';
import { colors } from '../../../../utils/colors';
import ProfileItem from '../components/ProfileItem';
import SmallCard from '../components/SmallCard';
import styles from './Content.style';


function Content({ issues, session, profile, department, statuses }) {
  const [photo, setPhoto] = useState(null);
  const [_issues, setIssues] = useState([]);
  const [nbOpened, setNbOpened] = useState(0);
  const [nbAssigned, setNbAssigned] = useState(0);
  const [nbProcessedByYou, setNbProcessedByYou] = useState(0);
  const [villagesExpanded, setVillagesExpanded] = useState(false);
  const dispatch = useDispatch();
  // Field staff (FC / SC) are reporter accounts: they follow the issues they reported
  const reporter = isFacilitator(profile);
  const reporterCounters = getReporterCounters(issues ?? [], profile?.user?.id, statuses ?? []);
  const coveredVillages = getCoveredVillages(profile);

  //fetch user photo

  useEffect(() => {
    if (profile?.user?.photo) {
      setPhoto(
      profile.user.photo.startsWith('https://')
        ? profile.user.photo
        : `${baseURL}${profile.user.photo}`
      );
    }
  }, [profile]);

  useEffect(() => {
    if (!issues) return;
    setIssues(issues);

    // ISSUES CREATED BY THE CURRENT USER
    setNbOpened(issues.filter((issue) => issue.reporter && issue.reporter.id === profile?.user?.id).length);

    // ISSUES ASSIGNED TO THE CURRENT USER
    setNbAssigned(issues.filter((issue) => issue.assignee && issue.assignee.id === profile?.user?.id).length);

    // ISSUES PROCESSED BY THE CURRENT USER
    let foundStatus = statuses.find((el) => el.final_status === true);
    let filteredIssues = issues.filter(
      (issue) =>
        issue.assignee && issue.assignee.id === profile?.user?.id && issue.status.id === foundStatus.id
    );
    setNbProcessedByYou(filteredIssues.length);

  }, [issues]);

  return (
    <View>
      <View style={styles.containerA}>
        <UserAvatar userName={session.username} src={photo} size={120} />
      </View>
      <Text style={styles.listHeader}>{i18n.t('your_complaint_count')}</Text>
      {reporter ? (
        <View style={styles.cardContainer}>
          <SmallCard image={require('../../../../../assets/BG_2.png')} title={i18n.t('reported')} count={reporterCounters.reported} />
          <SmallCard image={require('../../../../../assets/BG_9.png')} title={i18n.t('in_progress')} count={reporterCounters.inProgress} />
          <SmallCard image={require('../../../../../assets/BG_1.png')} title={i18n.t('closed')} count={reporterCounters.closed} />
        </View>
      ) : (
        <View style={styles.cardContainer}>
          <SmallCard
            image={require('../../../../../assets/BG_2.png')}
            title={i18n.t('reported')}
            count={nbOpened}
          />
          <SmallCard
            image={require('../../../../../assets/BG_9.png')}
            title={i18n.t('assigned')}
            count={nbAssigned}
          />
          <SmallCard
            image={require('../../../../../assets/BG_1.png')}
            title={i18n.t('resolved')}
            count={nbProcessedByYou}
          />
        </View>
      )}
      <Text style={styles.listHeader}>{i18n.t('your_personal_info')}</Text>
      <ProfileItem title={i18n.t('full_name')} description={profile?.user?.name} />
      <ProfileItem title={i18n.t('email')} description={profile?.user?.email || session?.username} />
      <ProfileItem title={i18n.t('phone')} description={profile?.user?.phone} />
      <ProfileItem title={i18n.t('location')} description={getLocationLabel(profile)} />
      <ProfileItem title={i18n.t('account_type')} description={getAccountLabel(profile, (key) => i18n.t(key))} />
      {isCommittee(profile) && <ProfileItem title={i18n.t('department')} description={department?.name} />}
      {reporter && (
        <TouchableOpacity onPress={() => setVillagesExpanded(!villagesExpanded)}>
          <ProfileItem
            title={`${i18n.t('covered_villages')} (${coveredVillages.length})`}
            description={
              villagesExpanded
                ? coveredVillages.map((village) => village.name).join(', ')
                : i18n.t('tap_to_show')
            }
          />
        </TouchableOpacity>
      )}
      <View style={styles.containerA}>
        <Button color={colors.primary} onPress={() => dispatch(logout())}>
          {i18n.t('logout')}
        </Button>
      </View>
      {/* App and local database versions, for support */}
      <Text style={{ textAlign: 'center', color: colors.secondary, fontSize: 12, marginBottom: 16 }}>{appVersion}</Text>
    </View>
  );
}

export default Content;
