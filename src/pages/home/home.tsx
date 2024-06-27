import { useCallback, useMemo, useState } from 'react';
import { useAsyncRetry } from 'react-use';
import EditablePicture from '../../components/editable-picture';
import EditableText from '../../components/editable-text';
import FlipButton from '../../components/flip-button';
import { getProfile, setProfile } from './apis';
import { Profile } from './types';
import { validator } from './validator';

type ProfileValidationErrors = { [key in keyof Profile]?: string };

export function Home() {
  const getProfileState = useAsyncRetry(getProfile, []);

  const [editMode, setEditMode] = useState(false);
  const [changedProfile, setChangedProfile] = useState<Partial<Profile>>({});

  const handleProfileChange = useCallback(
    (name: keyof Profile, value: string) => {
      const newChangedProfile = { ...changedProfile, [name]: value };

      if (getProfileState.value?.[name] === value) {
        delete newChangedProfile[name];
      }

      setChangedProfile(newChangedProfile);
    },
    [changedProfile, getProfileState.value],
  );

  function getProfileValue(name: keyof Profile) {
    return changedProfile[name] ?? getProfileState.value?.[name];
  }

  const errors = useMemo<ProfileValidationErrors>(() => {
    const result: ProfileValidationErrors = {};

    let key: keyof ProfileValidationErrors;
    for (key in changedProfile) {
      if (Object.hasOwn(changedProfile, key)) {
        const message = validator[key]?.(changedProfile[key]);
        if (message) result[key] = message;
        else delete result[key];
      }
    }
    return result;
  }, [changedProfile]);

  const handleDefaultClick = useCallback(() => {
    setEditMode(true);
  }, []);

  const handleFlipedClick = useCallback(async () => {
    if (Object.keys(errors).length) {
      return;
    }
    if (Object.keys(changedProfile).length) {
      await setProfile(changedProfile);
      getProfileState.retry();
      setChangedProfile({});
    }
    setEditMode(false);
  }, [changedProfile, errors, getProfileState]);

  return (
    <div className="bg-gradient-to-tr from-orange-400 via-red-300 to-blue-500 min-h-screen flex items-center justify-center p-12 md:p-20">
      <div className="bg-white rounded-lg shadow-2xl w-full md:max-w-4xl overflow-hidden text-neutral-400 p-8 pb-16 relative flex flex-col md:flex-row items-center gap-2">
        <div className="flex flex-col items-center gap-2">
          {!!getProfileState.value?.picture && (
            <EditablePicture
              className="w-32 h-32"
              value={getProfileValue('picture')}
              onChange={(value) => handleProfileChange('picture', value)}
              editable={editMode}
            />
          )}
          {!!getProfileState.value?.name && (
            <EditableText
              className="text-base font-bold text-neutral-900"
              value={getProfileValue('name')}
              onChange={(value) => handleProfileChange('name', value)}
              editable={editMode}
              error={errors.name}
            />
          )}
        </div>
        <div className="flex flex-col items-center gap-2 w-full md:flex-1">
          {!!getProfileState.value?.description && (
            <EditableText
              className="w-full min-h-10 text-sm text-left text-neutral-400"
              value={getProfileValue('description')}
              onChange={(value) => handleProfileChange('description', value)}
              editable={editMode}
              error={errors.description}
            />
          )}
          <hr className="w-full border-neutral-100 my-2" />
          <div className="w-full flex flex-row flex-wrap">
            <div className="flex flex-row items-start justify-start text-sm w-full pr-2 pb-2 md:w-1/2">
              <h5 className="flex flex-row items-center gap-1 w-20 justify-end text-neutral-600">
                Phone
                <svg
                  className="w-3.5 h-3.5 fill-current"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="200"
                  height="200">
                  <path d="M926.47619 355.644952V780.190476a73.142857 73.142857 0 0 1-73.142857 73.142857H170.666667a73.142857 73.142857 0 0 1-73.142857-73.142857V355.644952l304.103619 257.828572a170.666667 170.666667 0 0 0 220.745142 0L926.47619 355.644952zM853.333333 170.666667a74.044952 74.044952 0 0 1 26.087619 4.778666 72.704 72.704 0 0 1 30.622477 22.186667 73.508571 73.508571 0 0 1 10.678857 17.67619c3.169524 7.509333 5.12 15.652571 5.607619 24.210286L926.47619 243.809524v24.380952L559.469714 581.241905a73.142857 73.142857 0 0 1-91.306666 2.901333l-3.632762-2.925714L97.52381 268.190476v-24.380952a72.899048 72.899048 0 0 1 40.155428-65.292191A72.97219 72.97219 0 0 1 170.666667 170.666667h682.666666z" />
                </svg>
              </h5>
              {!!getProfileState.value?.phone && (
                <EditableText
                  className="flex-1 w-0 text-ellipsis text-left text-sm font-medium break-all"
                  value={getProfileValue('phone')}
                  onChange={(value) => handleProfileChange('phone', value)}
                  editable={editMode}
                  error={errors.phone}
                />
              )}
            </div>
            <div className="flex flex-row items-start justify-start text-sm w-full pr-2 pb-2 md:w-1/2">
              <h5 className="flex flex-row items-center gap-1 w-20 justify-end text-neutral-600">
                Email
                <svg
                  className="w-3.5 h-3.5 fill-current"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="200"
                  height="200">
                  <path d="M289.103444 67.119677c17.175171 0.066515 31.840172 1.620917 41.769312 8.950859 12.68388 9.363252 27.325345 38.59297 40.596604 70.302159 13.659091 32.636305 25.867134 67.898413 32.996508 86.830601 5.055133 13.424754 21.980617 53.651944 16.907065 72.599482-9.543354 35.632545-57.501622 35.68678-71.604828 65.637929-10.822486 22.984481 10.677177 50.925856 19.890003 65.637929 16.591887 26.494421 35.499515 51.071166 55.16746 74.922387 24.531719 29.749558 50.244334 58.371432 74.119091 88.177272 26.134217 32.627095 57.906851 70.828139 94.478791 92.489484 47.960315 28.40698 69.844741-67.99358 122.076336-49.974182 55.4458 19.128663 57.101509 20.399609 100.902084 52.590775 6.176676 4.539386 22.291702 14.119579 38.317701 26.482141 23.192212 17.891486 48.800449 41.494043 53.965076 51.456952 10.253528 19.783579 0.898463 46.990221-6.961552 62.653969-21.88545 43.61331-54.374398 79.173201-95.473445 103.428627-54.018288 31.881105-118.154004 15.858176-174.195368-12.125155-44.597731-22.269189-84.070744-52.111868-109.239983-71.414493-41.297568-31.671327-79.121012-66.965158-114.475218-104.708783-27.854395-29.737278-54.174853-60.994166-79.45461-93.198635-28.646434-36.494169-57.627489-72.115458-84.885296-109.497856-33.17661-45.499263-63.800072-93.607958-88.159876-149.075247-22.437012-51.089585-69.121264-163.648151-29.835516-230.726895 23.802102-40.641629 67.228147-71.433936 113.37414-89.505523C254.649747 73.072249 272.614911 73.751724 289.103444 67.119677z" />
                </svg>
              </h5>
              {!!getProfileState.value?.email && (
                <EditableText
                  className="flex-1 w-0 text-ellipsis text-left text-sm font-medium break-all"
                  value={getProfileValue('email')}
                  onChange={(value) => handleProfileChange('email', value)}
                  editable={editMode}
                  error={errors.email}
                />
              )}
            </div>
            <div className="flex flex-row items-start justify-start text-sm w-full pr-2 pb-2 md:w-1/2">
              <h5 className="flex flex-row items-center gap-1 w-20 justify-end text-neutral-600">
                Address
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="200"
                  height="200"
                  className="w-3.5 h-3.5 fill-current"
                  viewBox="0 0 1024 1024">
                  <path d="M512 860.8S192 593.28 192 302.08 512 0 512 0s323.84 8.96 323.84 300.8S512 860.8 512 860.8z" />
                  <path d="M518.4 458.88A152.96 152.96 0 11672 305.92a152.96 152.96 0 01-153.6 152.96zm0-238.72a85.76 85.76 0 1086.4 85.76 85.76 85.76 0 00-86.4-85.76z" />
                  <path d="M521.6 807.68h-18.56l9.6 8.32z" />
                  <path d="M674.56 807.68H617.6a1109.12 1109.12 0 01-83.84 79.36L512 904.96l-21.76-17.92c-3.84-3.84-38.4-32.64-83.84-79.36h-55.68C256 827.52 192 865.28 192 908.16c0 64 142.08 115.84 320 115.84s323.84-51.84 323.84-115.84c.64-42.88-64.64-80.64-161.28-100.48z" />
                </svg>
              </h5>
              {!!getProfileState.value?.address && (
                <EditableText
                  className="flex-1 w-0 text-ellipsis text-left text-sm font-medium break-all"
                  value={getProfileValue('address')}
                  onChange={(value) => handleProfileChange('address', value)}
                  editable={editMode}
                  error={errors.address}
                />
              )}
            </div>
            <div className="flex flex-row items-start justify-start text-sm w-full pr-2 pb-2 md:w-1/2">
              <h5 className="flex flex-row items-center gap-1 w-20 justify-end text-neutral-600">
                Hobby
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="200"
                  height="200"
                  className="w-3.5 h-3.5 fill-current"
                  viewBox="0 0 1024 1024">
                  <path d="M512 896.307c8.294 0 16.18-3.174 22.016-9.011l311.706-300.237c4.505-4.505 114.585-105.062 114.585-225.177 0-146.637-89.6-234.19-239.206-234.19-87.552 0-169.677 69.018-209.203 108.135-39.527-39.014-121.55-108.134-209.204-108.134-149.606 0-239.206 87.654-239.206 234.189 0 120.115 110.08 220.672 114.074 224.153l312.217 301.261A31.992 31.992 0 00512 896.307z" />
                </svg>
              </h5>
              {!!getProfileState.value?.address && (
                <EditableText
                  className="flex-1 w-0 text-ellipsis text-left text-sm font-medium break-all"
                  value={getProfileValue('hobby')}
                  onChange={(value) => handleProfileChange('hobby', value)}
                  editable={editMode}
                  error={errors.hobby}
                />
              )}
            </div>
          </div>
        </div>
        <FlipButton
          className="bg-blue-400 text-white w-full text-sm absolute bottom-0 left-0 right-0 overflow-hidden md:w-28 md:rounded-md md:right-8 md:bottom-5 md:left-auto"
          defaultContent="EDIT ME"
          flipedContent="SAVE ME"
          fliped={editMode}
          onDefaultClick={handleDefaultClick}
          onFlipedClick={handleFlipedClick}
        />
      </div>
    </div>
  );
}
